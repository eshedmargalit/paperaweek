interface Venue {
  display_name: string;
  url: string;
}

interface Author {
  display_name: string;
}

interface Institution {
  display_name: string;
}

export interface Authorship {
  author: Author;
  institutions: Institution[];
}

export interface Work {
  display_name: string;
  publication_date: string;
  host_venue: Venue;
  authorships: Authorship[];
  doi: string;
}

export interface WorksResponse {
  results: Work[];
}
