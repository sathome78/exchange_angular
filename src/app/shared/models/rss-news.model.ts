

export interface RssNews {
  date: number;
  url: string;
  title: string;
}

export interface RssNewsResponsse {
  data: {
    feeds: RssNews[];
    count: number;
  };
}
