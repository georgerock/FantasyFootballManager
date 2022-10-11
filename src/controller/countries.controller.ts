import { Request, Response } from 'express';
import { GetCountryInput } from '../schema/country.schema';
import { getAllCountries, getCountryById } from '../service/country.service';

export const getCountryHandler = async (
  { params: { countryId } }: Request<GetCountryInput['params']>,
  res: Response
) => {
  const id = parseInt(countryId, 10);
  if (id < 0 || isNaN(id)) {
    return res.status(400).send([
      {
        code: '400',
        message: 'Invalid country id',
        path: ['params', 'countryId'],
      },
    ]);
  }

  const countryData = await getCountryById(id);
  if (!countryData) {
    return res.status(404).send([
      {
        code: '404',
        message: 'Country not found',
        path: [],
      },
    ]);
  }

  return res.send(countryData);
};

export const getAllCountriesHandler = async (_req: Request, res: Response) => {
  const allCountries = await getAllCountries();
  res.send(allCountries);
};
