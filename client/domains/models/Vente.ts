import { z } from "zod";
import { WorkflowSchema } from "./Workflow";
import { ProduitSchema } from "./Produit";

export const VenteSchema = z.object({
  _id: z.string(),
  qte: z.number(),
  sourceType: z.enum(["WEBFORM", "EXCEL", "GOOGLE"]),

  workflowId: z.union([z.string(), WorkflowSchema]),
  produitId: z.union([z.string(), ProduitSchema]).optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Vente = z.infer<typeof VenteSchema>;
