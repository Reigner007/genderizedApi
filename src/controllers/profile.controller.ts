import { Request, Response } from 'express';
import * as profileService from '../services/profile.service';

export const createProfileHandler = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfile(req.body.name);
    const statusCode = result.message ? 200 : 201;
    res.status(statusCode).json(result);
  } catch (err: any) {
    throw err; // Let error middleware handle it
  }
};

export const getProfileHandler = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await profileService.getProfileById(id);
    res.json(result);
  } catch (err: any) {
    throw err;
  }
};

export const getAllProfilesHandler = async (req: Request, res: Response) => {
  try {
    // Convert query params safely (they can be string | string[])
    const query: any = {};
    if (req.query.gender) query.gender = Array.isArray(req.query.gender) ? req.query.gender[0] : req.query.gender;
    if (req.query.country_id) query.country_id = Array.isArray(req.query.country_id) ? req.query.country_id[0] : req.query.country_id;
    if (req.query.age_group) query.age_group = Array.isArray(req.query.age_group) ? req.query.age_group[0] : req.query.age_group;

    const result = await profileService.getAllProfiles(query);
    res.json(result);
  } catch (err: any) {
    throw err;
  }
};

export const deleteProfileHandler = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await profileService.deleteProfile(id);
    res.status(204).send();
  } catch (err: any) {
    throw err;
  }
};