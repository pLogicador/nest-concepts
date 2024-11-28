import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class OtherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('OtherMiddleware: Hello');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Pedro',
        subname: 'Emanuel',
      };
    }

    res.setHeader('Header', 'middleware header');

    // ending the call chain
    /*
    return res.status(404).send({
      message: 'Not found',
    });
    */
    next();

    console.log('OtherMiddleware: Bye');
  }
}
