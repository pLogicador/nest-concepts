import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Hello');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Pedro',
        subname: 'Emanuel',
        role: 'admin',
      };
    }

    /*
    if (authorization) {
      throw new BadRequestException('Error example');
    }*/

    res.setHeader('Header', 'middleware header');

    // ending the call chain
    /*
    return res.status(404).send({
      message: 'Not found',
    });*/
    next(); // next middleware

    console.log('SimpleMiddleware: Bye');

    res.on('finish', () => {
      console.log('SimpleMiddleware: ended');
    });
  }
}
