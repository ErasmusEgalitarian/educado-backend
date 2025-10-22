import fs from 'fs'

/**
 * Merges OpenAPI files with filePaths and generates a single OpenAPI documentation at outputPath. Order matters. Priority of files in terms of duplicates go from high to low.
 * @param filePaths Array of paths for files that need to be merged
 * @param outputPath Where to output the merged OpenAPI documentation
 */
const mergeAPIDocs = (filePaths : string[], outputPath : string) : void => {
    // Read generated documentation by Strapi
    let documentations = [];
    for (let file of filePaths)
    {
        let docsFile : any = fs.readFileSync(file);
        documentations.push(JSON.parse(docsFile))
    }

    const mergedResult = documentations.reduce((acc, spec) => {
        return {
            ...acc,
            ...spec,
            paths: {
                ...acc.paths,
                ...spec.paths
            },
            components: {
                ...acc.components,
                ...spec.components,
                schemas: {
                    ...acc.components.schemas,
                    ...spec.components.schemas
                }
            }
        }
    });

    fs.writeFileSync(outputPath, JSON.stringify(mergedResult, null, 2));
}

/**
 * Specific function to merge custom API documentation with Swagger content for CRUD
 */
const mergeSwaggerDocumentation = () : void => {
    let folderPath = "src/extensions/documentation/custom/";
    let fullDocsPath = "src/extensions/documentation/documentation/1.0.0/full_documentation.json"
    let filePaths = fs.readdirSync(folderPath).map(path => folderPath + path);
    filePaths.unshift(fullDocsPath)
    mergeAPIDocs(filePaths, fullDocsPath);
}

/**
 * Specific function to merge OpenAPI spec generated with "npm run generate-spec"
 */
const mergeGeneratedSpec = () : void => {
    let folderPath = "src/extensions/documentation/custom/";
    let fullDocsPath = "../openapi/strapi-spec.json";
    let filePaths = fs.readdirSync(folderPath).map(path => folderPath + path);
    filePaths.unshift(fullDocsPath)
    mergeAPIDocs(filePaths, fullDocsPath);
}

export { mergeAPIDocs, mergeSwaggerDocumentation, mergeGeneratedSpec }