import { useQuery } from '@tanstack/react-query';
import { resourcesApi, exercisesApi, goalsApi, journalApi } from '../utils/api';

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await resourcesApi.getResources();
      return response.data;
    }
  });
};

export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const response = await exercisesApi.getExercises();
      return response.data;
    }
  });
};

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await goalsApi.getGoals();
      return response.data;
    }
  });
};

export const useJournals = () => {
  return useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const response = await journalApi.getJournals();
      return response.data;
    }
  });
};
