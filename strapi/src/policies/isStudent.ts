/**
 * isStudent policy
 */

import jwt from 'jsonwebtoken';

export default (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In isStudent policy.');

    let requestBody = policyContext.request.ctx.request.body;

    const secretKey = "1234";

    let signedToken = jwt.sign(requestBody,secretKey)
    console.log(signedToken);


    let canDoSomething : Boolean = false;

    console.log(jwt.verify(signedToken, secretKey));
    let signedTokenUsername : any = jwt.verify(signedToken, secretKey);

    if ( JSON.stringify(requestBody.username) == JSON.stringify(signedTokenUsername.username)){
      console.log("works");
      canDoSomething = true;
    }

    if (canDoSomething) {
      return true;
    }

    return false;
};
