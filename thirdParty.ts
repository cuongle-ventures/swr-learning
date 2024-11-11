import AxiosMockAdapter from 'axios-mock-adapter';
import instance from './src/api/axios';

export const mockHttp = new AxiosMockAdapter(instance);
