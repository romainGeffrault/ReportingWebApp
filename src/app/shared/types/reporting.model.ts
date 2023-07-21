import { Author } from "./author.model";
import { Observation } from "./observation.model";

export type Reporting = {
    id?: number;
    author: Author;
    observations: Observation[];
    description: string;
};

export type EditedReport = Omit<Reporting, 'observations'> & { observations: number[] };
