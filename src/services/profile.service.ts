import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

const getAgeGroup = (age: number): string => {
  if (age <= 12) return 'child';
  if (age <= 19) return 'teenager';
  if (age <= 59) return 'adult';
  return 'senior';
};

const formatResponse = (profile: any) => ({
  id: profile.id,
  name: profile.name, 
  gender: profile.gender,
  gender_probability: profile.genderProbability,
  sample_size: profile.sampleSize,
  age: profile.age,
  age_group: profile.ageGroup,
  country_id: profile.countryId,
  country_probability: profile.countryProbability,
  created_at: profile.createdAt.toISOString(),
});

export const createProfile = async (nameInput: any) => {
  // Better validation for 400 and 422
  if (typeof nameInput !== 'string' || !nameInput.trim()) {
    const error: any = new Error('Name is required');
    error.status = 400;
    throw error;
  }

  const name = nameInput.trim().toLowerCase();

  // Idempotency
  let existing = await prisma.profile.findUnique({ where: { name } });
  if (existing) {
    return {
      status: 'success',
      message: 'Profile already exists',
      data: formatResponse(existing),
    };
  }

  // Call external APIs
  const [genderRes, ageRes, natRes] = await Promise.all([
    axios.get(`https://api.genderize.io?name=${name}`),
    axios.get(`https://api.agify.io?name=${name}`),
    axios.get(`https://api.nationalize.io?name=${name}`),
  ]);

  const g = genderRes.data;
  const a = ageRes.data;
  const n = natRes.data;

  if (!g.gender || (g.count ?? 0) === 0) {
    throw { status: 502, message: 'Genderize returned an invalid response' };
  }
  if (a.age === null || a.age === undefined) {
    throw { status: 502, message: 'Agify returned an invalid response' };
  }
  if (!n.country || n.country.length === 0) {
    throw { status: 502, message: 'Nationalize returned an invalid response' };
  }

  const ageGroup = getAgeGroup(a.age);
  const topCountry = n.country.reduce((prev: any, curr: any) =>
    curr.probability > prev.probability ? curr : prev
  );

  const profile = await prisma.profile.create({
    data: {
      id: uuidv7(),
      name,
      gender: g.gender,
      genderProbability: Number(g.probability?.toFixed(2)),
      sampleSize: g.count,
      age: a.age,
      ageGroup,
      countryId: topCountry.country_id,
      countryProbability: Number(topCountry.probability.toFixed(2)),
    },
  });

  return {
    status: 'success',
    data: formatResponse(profile),
  };
};

export const getProfileById = async (id: string) => {
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) throw { status: 404, message: 'Profile not found' };
  return { status: 'success', data: formatResponse(profile) };
};

export const getAllProfiles = async (query: any) => {
  const { gender, country_id, age_group } = query;

  const where: any = {};
  if (gender) where.gender = { equals: gender, mode: 'insensitive' };
  if (country_id) where.countryId = country_id.toUpperCase();
  if (age_group) where.ageGroup = age_group.toLowerCase();

  const profiles = await prisma.profile.findMany({
    where,
    select: {
      id: true,
      name: true,
      gender: true,
      age: true,
      ageGroup: true,
      countryId: true,
    },
  });

  return {
    status: 'success',
    count: profiles.length,
    data: profiles,
  };
};

export const deleteProfile = async (id: string) => {
  await prisma.profile.delete({ where: { id } }).catch(() => {
    throw { status: 404, message: 'Profile not found' };
  });
};