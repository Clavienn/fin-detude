import { Router } from "express";
import {
  createFormation,
  getFormations,
  analyseFormations,
  predictParticipation,
  updateFormation,
} from "../controllers/FormationController";

const router = Router();

router.post("/", createFormation);
router.get("/", getFormations);

/** DATANOVA */
router.put("/:id", updateFormation);
router.get("/analyse", analyseFormations);
router.get("/prediction/participation", predictParticipation);

export default router;
