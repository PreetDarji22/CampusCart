import express from 'express';
import {
  getRequirements,
  createRequirement,
  deleteRequirement,
  fulfillRequirement
} from '../controllers/requirementController.js';

const router = express.Router();

router.route('/')
  .get(getRequirements)
  .post(createRequirement);

router.route('/:id')
  .delete(deleteRequirement);

router.route('/:id/fulfill')
  .patch(fulfillRequirement);

export default router;
