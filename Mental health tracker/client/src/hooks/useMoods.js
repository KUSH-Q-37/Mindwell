import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodApi } from '../utils/api';

export const useMoods = (options = {}) => {
  return useQuery({
    queryKey: ['moods'],
    queryFn: async () => {
      const response = await moodApi.getMoods();
      return response.data;
    },
    ...options
  });
};

export const useMood = (id) => {
  return useQuery({
    queryKey: ['mood', id],
    queryFn: async () => {
      const response = await moodApi.getMood(id);
      return response.data;
    },
    enabled: !!id
  });
};

export const useMoodForecast = () => {
  return useQuery({
    queryKey: ['mood-forecast'],
    queryFn: async () => {
      const response = await moodApi.getFuturePrediction();
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCreateMood = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newMood) => moodApi.createMood(newMood),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
      queryClient.invalidateQueries({ queryKey: ['mood-forecast'] });
    }
  });
};
