import { FeatureCollection } from 'geojson';
import mongoose from 'mongoose';
import GeoJSON from 'mongoose-geojson-schema';

export interface Project {
  id: mongoose.Types.ObjectId;
  name: string;
  perimeter: FeatureCollection;
}

export const projectMongooseSchema = new mongoose.Schema<Project>({
  id: mongoose.Types.ObjectId,
  name: { type: String, required: true },
  perimeter: { type: GeoJSON, required: true },
});

export const ProjectModel = mongoose.model('Project', projectMongooseSchema);
