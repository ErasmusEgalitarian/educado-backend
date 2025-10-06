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

export interface ContentVideo extends Struct.ComponentSchema {
  collectionName: 'components_content_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    video: Schema.Attribute.Media<'videos', true> & Schema.Attribute.Required;
  };
}

export interface RoleContentCreator extends Struct.ComponentSchema {
  collectionName: 'components_role_content_creators';
  info: {
    displayName: 'Content Creator';
  };
  attributes: {
    courses: Schema.Attribute.Relation<'oneToMany', 'api::course.course'>;
    verifiedAt: Schema.Attribute.Date;
  };
}

export interface RoleStudent extends Struct.ComponentSchema {
  collectionName: 'components_role_students';
  info: {
    displayName: 'Student';
  };
  attributes: {
    courses: Schema.Attribute.Relation<'oneToMany', 'api::course.course'>;
    feedbacks: Schema.Attribute.Relation<'oneToMany', 'api::feedback.feedback'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.description': ContentDescription;
      'content.video': ContentVideo;
      'role.content-creator': RoleContentCreator;
      'role.student': RoleStudent;
    }
  }
}
