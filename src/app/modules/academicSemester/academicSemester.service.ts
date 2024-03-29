import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemesterSearchableFields, academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemseter } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemseter) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDB = async (query: Record<string, unknown>,) => {
  // const result = await AcademicSemester.find();
  // return result;
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
  .search(AcademicSemesterSearchableFields)
  .filter()
  .sort()
  .paginate()
  .fields();

const result = await academicSemesterQuery.modelQuery;
const meta = await academicSemesterQuery.countTotal();

return {
  meta,
  result,
};
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  if (!(await AcademicSemester.isAcademicSemesterExists(id))) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Academic Semester does not exist Exist!',
    );
  }
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemseter>,
) => {
  if (!(await AcademicSemester.isAcademicSemesterExists(id))) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Academic Semester does not exist Exist!',
    );
  } else if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
