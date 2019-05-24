interface ResponseModel<T> {
  count: number;
  items: T;
}

interface ParsedToken {
  expiration: number;
  username: string;
  publicId: string;
  token_id: number;
  userRole: string;
  value: string;
}

interface MapModel<T>{
  [key: string]: T;
}

interface ResponseModelIEO<T> {
  error: any;
  data: T;
}
