import type {
  Formation,
  FormationAnalyse,
  FormationPrediction,
} from "@/domains/models/Formation";

export interface FormationRepository {
  create(data: Omit<Formation, "_id">): Promise<Formation>;
  getAll(): Promise<Formation[]>;
  update(
    id: string,
    data: Partial<Omit<Formation, "_id">>
  ): Promise<Formation>;
  analyse(): Promise<FormationAnalyse>;
  predictParticipation(): Promise<FormationPrediction>;
}
