import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { logger } from '@src/server';

import { Project } from './projectModel';
import { projectRepository } from './projectRepository';

export const projectService = {
  findAll: async (): Promise<ServiceResponse<Project[] | null>> => {
    try {
      const projects = await projectRepository.findAllAsync();
      if (!projects) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Projects found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Project[]>(ResponseStatus.Success, 'Project found', projects, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all projects: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: mongoose.Types.ObjectId): Promise<ServiceResponse<Project | null>> => {
    try {
      const user = await projectRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Project not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Project>(ResponseStatus.Success, 'Project found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding Project with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (project: Project): Promise<ServiceResponse> => {
    try {
      const projectCreated = await projectRepository.create(project);
      if (!projectCreated) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Couldn\t create project',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      return new ServiceResponse<null>(ResponseStatus.Success, 'Project created', null, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating project: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  delete: async (id: mongoose.Types.ObjectId): Promise<ServiceResponse> => {
    try {
      const projectDeleted = await projectRepository.delete(id);
      if (!projectDeleted) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Couldn\t delete project',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      return new ServiceResponse<null>(ResponseStatus.Success, 'Project deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting project: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  edit: async (id: mongoose.Types.ObjectId, project: Project): Promise<ServiceResponse<Project | null>> => {
    try {
      const newProject = await projectRepository.edit(id, project);
      if (!newProject) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Couldn\t edit project',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      return new ServiceResponse<Project>(ResponseStatus.Success, 'Project edited', newProject, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error editing project: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  intersect: async ({
    id1,
    id2,
  }: {
    id1: mongoose.Types.ObjectId;
    id2: mongoose.Types.ObjectId;
  }): Promise<ServiceResponse<boolean | null>> => {
    try {
      const doesIntersect = await projectRepository.intersect({ id1, id2 });

      return new ServiceResponse<boolean>(
        ResponseStatus.Success,
        `Projects ${doesIntersect ? 'intersect' : 'do not intersect'}`,
        doesIntersect,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding if projects intersect: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  merge: async ({
    id1,
    id2,
  }: {
    id1: mongoose.Types.ObjectId;
    id2: mongoose.Types.ObjectId;
  }): Promise<ServiceResponse<Project['perimeter'] | null>> => {
    try {
      const projectMerged = await projectRepository.merge({ id1, id2 });

      return new ServiceResponse<Project['perimeter']>(
        ResponseStatus.Success,
        `Projects merged`,
        projectMerged,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error merging projects: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
