// @ts-ignore
/* eslint-disable */
import * as user from './session';
import difficulties from './difficulties';
import equipment from './equipment';
import goals from './goals';
import muscles from './muscles';
import tags from './tags';
import exercises from './exercises';
import exerciseGroups from './exercise-groups';
import plans from './plans';
import units from './units';
import users from './users';

export type DifficultiesApiType = typeof difficulties;
export type EquipmentApiType = typeof equipment;
export type GoalsApiType = typeof goals;
export type MusclesApiType = typeof muscles;
export type TagsApiType = typeof tags;
export type ExercisesApiType = typeof exercises;
export type ExerciseGroupsApiType = typeof exerciseGroups;
export type PlansApiType = typeof plans;
export type UnitsApiType = typeof units;
export type UsersApiType = typeof users;

export default {
  user,
  difficulties,
  equipment,
  goals,
  muscles,
  tags,
  exercises,
  exerciseGroups,
  plans,
  units,
  users,
};
