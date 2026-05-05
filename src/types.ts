
export enum Domain {
  EnvMethod = "Environnement/Méthodes",
  Calculs = "Calculs",
  MiseEnForme = "Mise en forme",
  Donnees = "Gestion des données"
}

export enum Difficulty {
  Facile = "F",
  Moyen = "M"
}

export enum QuestionType {
  QCM = "QCM",
  Practical = "Pratique"
}

export interface Question {
  id: number;
  domain: Domain;
  difficulty: Difficulty;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | number; // Index or string
  explanation: string;
  trap: string;
  tip: string;
  miniExercise?: string;
  tableData?: string; // Markdown table
}

export enum TosaLevel {
  Initial = "Initial",
  Basique = "Basique",
  Operationnel = "Opérationnel",
  Avance = "Avancé",
  Expert = "Expert"
}

export interface UserSession {
  currentLevel: TosaLevel | "Je ne sais pas";
  targetLevel: TosaLevel;
  objective: "Découvrir" | "Réviser" | "Me rassurer";
  autoHint: boolean;
}
