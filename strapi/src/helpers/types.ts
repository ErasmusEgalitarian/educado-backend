/**
 * Types used for JWT signing
 */
type Student = {
    /**
     * the id created by strapi
     */
    documentId: String;
    name: String;
    email: String;
    password: String;
    verifiedAt: Date;
};

/**
 * Types used for JWT signing
 */
type ContentCreator = {
    /**
     * the id created by strapi
     */
    documentId: String;
    name: String;
    email: String;
    password: String;
    verifiedAt: Date;
};