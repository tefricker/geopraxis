import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { handleServiceResponse } from '@common/utils/httpHandlers';

import { projectService } from './projectService';

export const projectRouter: Router = (() => {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await projectService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as mongoose.Types.ObjectId | undefined;
    if (!id) {
      handleServiceResponse(
        new ServiceResponse(ResponseStatus.Failed, 'No ID provided', null, StatusCodes.NOT_FOUND),
        res
      );
      return;
    }
    const serviceResponse = await projectService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as mongoose.Types.ObjectId | undefined;
    if (!id) {
      handleServiceResponse(
        new ServiceResponse(ResponseStatus.Failed, 'No ID provided', null, StatusCodes.NOT_FOUND),
        res
      );
      return;
    }
    const serviceResponse = await projectService.delete(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as mongoose.Types.ObjectId | undefined;
    if (!id) {
      handleServiceResponse(
        new ServiceResponse(ResponseStatus.Failed, 'No ID provided', null, StatusCodes.NOT_FOUND),
        res
      );
      return;
    }
    const serviceResponse = await projectService.edit(id, req.body);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', async (req: Request, res: Response) => {
    const serviceResponse = await projectService.create(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/intersect', async (req: Request, res: Response) => {
    const serviceResponse = await projectService.intersect(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/merge', async (req: Request, res: Response) => {
    const serviceResponse = await projectService.merge(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
