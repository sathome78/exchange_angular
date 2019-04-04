interface ResponseModel<T> {
  count: number;
  items: T;
}

interface ParsedToken {
  expiration: number;
  username: string;
  token_id: number;
  value: string
}

interface MapModel<T>{
  [key: string]: T;
}


interface ResponseModelIEO<T> {
  error: any;
  data: T;
}
