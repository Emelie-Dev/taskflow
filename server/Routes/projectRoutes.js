import express from 'express';
import {
  createNewProject,
  deleteProject,
  getAllProjects,
  getAssignedProjects,
  getMyProjects,
  getProject,
  updateProject,
  updateTeam,
  respondToInvitation,
  uploadProjectFiles,
  deleteProjectFiles,
  getProjectActivities,
  deleteProjectActivities,
  exitProject,
} from '../Controllers/projectController.js';
import { protectRoute } from '../Controllers/authController.js';
import taskRouter from './taskRoutes.js';

const router = express.Router();

router.use(protectRoute);

// Nested route for accessing tasks of a project
router.use('/:projectId/tasks', taskRouter);

router.route('/').get(getAllProjects).post(createNewProject);

// For getting assigned projects
router.get('/assigned', getAssignedProjects);

router.get('/my_projects', getMyProjects);

router.route('/:id').get(getProject).patch(updateProject).delete(deleteProject);

router.route('/:id/files').post(uploadProjectFiles).patch(deleteProjectFiles);

router.route('/:id/team').patch(updateTeam).delete(exitProject);

router.patch('/:invitationId/reply-invitation', respondToInvitation);

router
  .route('/:id/activities')
  .get(getProjectActivities)
  .patch(deleteProjectActivities);

export default router;
