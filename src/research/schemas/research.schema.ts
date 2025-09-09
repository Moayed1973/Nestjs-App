import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResearchDocument = Research & Document;

@Schema({ timestamps: true })
export class Research {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  projectId: number;

  @Prop()
  fileName?: string;

  @Prop()
  fileType?: string;

  @Prop()
  fileSize?: number;
}

export const ResearchSchema = SchemaFactory.createForClass(Research);

// Create text index for search functionality
ResearchSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text',
});

ResearchSchema.index({ projectId: 1 });
ResearchSchema.index({ tags: 1 });
