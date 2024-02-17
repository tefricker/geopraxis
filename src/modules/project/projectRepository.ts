import { Feature, featureCollection, intersect, MultiPolygon, Polygon, Properties, union } from '@turf/turf';
import mongoose from 'mongoose';

import { logger } from '@src/server';

import { Project, ProjectModel } from './projectModel';

export const projectRepository = {
  findAllAsync: async (): Promise<Project[]> => {
    return await ProjectModel.find({});
  },

  findByIdAsync: async (id: mongoose.Types.ObjectId): Promise<Project> => {
    const result: Project | null = await ProjectModel.findById(id);
    if (!result) {
      throw new Error('Wrong project id');
    }
    return result;
  },

  create: async (project: Project): Promise<boolean> => {
    try {
      await ProjectModel.create(project);
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  },

  edit: async (id: mongoose.Types.ObjectId, project: Project): Promise<Project> => {
    const projectToEdit: Project | null = await ProjectModel.findOneAndUpdate({ id: id }, { name: project.name });
    if (!projectToEdit) {
      throw new Error('Wrong project id');
    }
    return projectToEdit;
  },

  delete: async (id: mongoose.Types.ObjectId): Promise<boolean> => {
    try {
      await ProjectModel.deleteOne({ id: id });
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  },

  intersect: async ({ id1, id2 }: { id1: mongoose.Types.ObjectId; id2: mongoose.Types.ObjectId }) => {
    const project1: Project | null = await ProjectModel.findById(id1);
    const project2: Project | null = await ProjectModel.findById(id2);
    if (!project1 || !project2) {
      throw new Error('Wrong project ids');
    }
    const f1 = project1.perimeter.features;
    const f2 = project2.perimeter.features;
    let doesIntersect = false;

    f1.forEach((parcel1) => {
      f2.forEach((parcel2) => {
        if (parcel1.geometry.type === 'Polygon' && parcel2.geometry.type === 'Polygon') {
          if (intersect(parcel1.geometry as Polygon, parcel2.geometry as Polygon)) {
            doesIntersect = true;
          }
        }
      });
    });
    return doesIntersect;
  },

  merge: async ({ id1, id2 }: { id1: mongoose.Types.ObjectId; id2: mongoose.Types.ObjectId }) => {
    const project1: Project | null = await ProjectModel.findById(id1);
    const project2: Project | null = await ProjectModel.findById(id2);
    if (!project1 || !project2) {
      throw new Error('Wrong project ids');
    }
    const f1 = project1.perimeter.features;
    const f2 = project2.perimeter.features;
    const newPolys: Feature<Polygon | MultiPolygon, Properties>[] = [];
    f1.forEach((parcel1) => {
      f2.forEach((parcel2) => {
        if (parcel1.geometry.type === 'Polygon' && parcel2.geometry.type === 'Polygon') {
          newPolys.push(
            union(parcel1.geometry as Polygon, parcel2.geometry as Polygon) as Feature<
              Polygon | MultiPolygon,
              Properties
            >
          );
        }
      });
    });
    if (newPolys.length >= 1) {
      return featureCollection(newPolys);
    }
    throw new Error('Provided projects contains no polygon');
  },
};
