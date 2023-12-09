import express, { NextFunction, Request, Response } from 'express'
import cookieParser from "cookie-parser";
import helmet from 'helmet'
import cors from 'cors'

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: false,
}))
app.use(helmet())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello world',
  });
});

app.get('/login', (req: Request, res: Response) => {
  console.log('bawa request cookie gak =>>>', req.cookies);

  console.log('req.headers.origin =>>>', req.headers.origin);

  res.cookie('cookieName', 'cookieValue');
  res
    .status(200)
    .json({
      success: true,
      message: 'Success to login'
    })
});


// need cookie to access this
const authMiddleware = (
  req: Request,
  res: Response, 
  next: NextFunction,
) => {
  const cookie = req.cookies['cookieName'];
  try {
    if (!cookie) {
      throw new Error('Please authenticate');
    }
    next();
  } catch (error: unknown) {
    next(error);
  }
}

app.get('/profile', authMiddleware, (req: Request, res: Response) => {
  console.log('req.headers.origin =>>>', req.headers.origin);

  res
    .status(200)
    .json({
      success: true,
      message: 'Success to get profile',
      data: {
        cookie: req.cookies['cookieName']
      }
    })
});

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res
    .status(201)
    .json({
      success: false,
      message: (err as Error).message,
    })
};
app.use(errorHandler);

const PORT = 3333;
app.listen(PORT, () => {
  console.log('Server hurung');
})