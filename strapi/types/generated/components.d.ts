import type { Schema, Struct } from '@strapi/strapi';

export interface ContentDescription extends Struct.ComponentSchema {
  collectionName: 'components_content_descriptions';
  info: {
    displayName: 'Text';
  };
  attributes: {
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4000;
        minLength: 1;
      }>;
  };
}

export interface ContentExercise extends Struct.ComponentSchema {
  collectionName: 'components_content_exercises';
  info: {
    displayName: 'Exercise';
  };
  attributes: {
    exercise: Schema.Attribute.Relation<'oneToOne', 'api::exercise.exercise'>;
  };
}

export interface ContentImage extends Struct.ComponentSchema {
  collectionName: 'components_content_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images'>;
  };
}

export interface ContentVideo extends Struct.ComponentSchema {
  collectionName: 'components_content_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    video: Schema.Attribute.Media<'videos', true> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.description': ContentDescription;
      'content.exercise': ContentExercise;
      'content.image': ContentImage;
      'content.video': ContentVideo;
    }
  }
}
