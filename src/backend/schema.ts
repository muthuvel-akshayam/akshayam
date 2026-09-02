import { z } from 'zod';
import {
  Gender,
  PhysicalCondition,
  MaritalStatus,
  FamilyStatus,
  Habit,
  ParentLivingStatus,
  WorkNature
} from '../../generated/prisma/client/browser';

export const personalInfoSchema = z.object({
  mobileNo: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  gender: z.nativeEnum(Gender, { message: 'Gender is required' }),
  livingCountry: z.string().min(1, 'Living country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  houseAddress: z.string().min(1, 'House address is required'),
  houseLocation: z.string().min(1, 'House location is required'),
  religion: z.string().min(1, 'Religion is required'),
  caste: z.string().min(1, 'Caste is required'),
  subCaste: z.string().optional(),
  koottam: z.string().optional(),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  tob: z.string().min(1, 'Time of birth is required'),
  lob: z.string().min(1, 'Place of birth is required'),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(300),
  physicalCondition: z.nativeEnum(PhysicalCondition),
  skinColour: z.string().min(1, 'Skin color is required'),
  maritalStatus: z.nativeEnum(MaritalStatus),
  haveChildren: z.boolean().optional(),
  numberOfChildren: z.number().or(z.nan()).transform(v => isNaN(v) ? undefined : v).optional(),
  childrenGender: z.string().optional(),
  childrenAge: z.string().optional(),
  familyStatus: z.nativeEnum(FamilyStatus),
  foodHabits: z.nativeEnum(Habit),
  drinkingHabits: z.nativeEnum(Habit),
  smokingHabits: z.nativeEnum(Habit),
  rasi: z.string().optional(),
  nakshatra: z.string().optional(),
  poruthaNakshatram: z.array(z.string()).default([]),
  dosham: z.string().optional(),
  
  jathakamUrl: z.string().optional(),
  photoUrl: z.string().min(1, 'Photo is required'),
  idProofUrl: z.string().optional(),
  casteCertificateUrl: z.string().optional(),
  rasiGrid: z.any().optional(),
  amsamGrid: z.any().optional(),
  dasaBalance: z.string().optional(),
  jathagamData: z.any().optional(),

  hideMobileNo: z.boolean().default(true),
  hideHouseAddress: z.boolean().default(true),
  hideHouseLocation: z.boolean().default(true),
  hidePhoto: z.boolean().default(false),
  educations: z.array(z.object({
    level: z.string().min(1, 'Education level is required'),
    degreeName: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
  })).default([]),
}).superRefine((data, ctx) => {
  if (data.religion?.toLowerCase() === 'hindu') {
    if (!data.rasi) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Rasi is required', path: ['rasi'] });
    if (!data.nakshatra) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nakshatra is required', path: ['nakshatra'] });
    if (!data.dosham) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Dosham is required', path: ['dosham'] });
    if (!data.jathakamUrl) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Jathakam is required', path: ['jathakamUrl'] });
  }
  if (['DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'].includes(data.maritalStatus)) {
    if (data.haveChildren === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'This field is required', path: ['haveChildren'] });
    }
    if (data.haveChildren === true) {
      if (!data.numberOfChildren) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Number of children is required', path: ['numberOfChildren'] });
      if (!data.childrenGender) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Gender is required', path: ['childrenGender'] });
      if (!data.childrenAge) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['childrenAge'] });
    }
  }
});

export const familyDetailsSchema = z.object({
  fatherName: z.string().min(1, 'Father name is required'),
  fatherLivingStatus: z.nativeEnum(ParentLivingStatus, { message: 'Status is required' }),
  fatherStatus: z.string().min(1, 'Father occupation is required'),
  fatherMobile: z.string().min(10, 'Mobile is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  motherLivingStatus: z.nativeEnum(ParentLivingStatus, { message: 'Status is required' }),
  motherStatus: z.string().min(1, 'Mother occupation is required'),
  motherMobile: z.string().min(10, 'Mobile is required'),
  workNature: z.nativeEnum(WorkNature, { message: 'Work nature is required' }),
  salary: z.string().optional(),
  organisation: z.string().optional(),
  designation: z.string().optional(),
  workingAddress: z.string().optional(),
  googleLocation: z.string().optional(),
  rentalIncome: z.string().min(1, 'Rental income is required'),
  houseType: z.string().min(1, 'House type is required'),
  houseSqFt: z.string().min(1, 'Sq.ft is required'),
  siteLand: z.string().min(1, 'Site land is required'),
  thottam: z.string().min(1, 'Thottam is required'),
  vacantLand: z.string().min(1, 'Vacant land is required'),
  totalAssetValue: z.string().min(1, 'Total asset value is required'),
  assetComments: z.string().min(1, 'Asset comments are required'),
  dowryDetails: z.string().optional(),
  siblings: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    relation: z.string().min(1, 'Relation is required'),
    status: z.string().min(1, 'Status is required'),
  })).default([]),
}).superRefine((data, ctx) => {
  if (data.workNature === 'JOB' || data.workNature === 'BUSINESS') {
    if (!data.salary) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Salary is required', path: ['salary'] });
    if (!data.organisation) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Organisation is required', path: ['organisation'] });
    if (!data.workingAddress) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Working address is required', path: ['workingAddress'] });
    if (!data.googleLocation) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Google location is required', path: ['googleLocation'] });
    if (data.workNature === 'JOB' && !data.designation) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Designation is required', path: ['designation'] });
    }
  }
});

export const expectationsSchema = z.object({
  expectedHeight: z.number().or(z.nan()).refine(v => !isNaN(v), { message: "Height is required" }),
  colourPreference: z.string().min(1, 'Colour preference is required'),
  maxAgeLimit: z.number().or(z.nan()).refine(v => !isNaN(v), { message: "Age limit is required" }),
  dowryExpectation: z.string().optional(),
  preferredSectors: z.array(z.string()),
  preferredLocations: z.array(z.string()),
  expectedIncome: z.string().min(1, 'Expected income is required'),
  expectsRentalIncome: z.boolean().optional(),
  expectsThottam: z.boolean().optional(),
  expectsVacantLand: z.boolean().optional(),
  preferredDistanceRadius: z.number().or(z.nan()).transform(v => isNaN(v) ? undefined : v).optional(),
  acceptsDivorced: z.boolean().optional(),
  city: z.string().min(1, 'Preferred city is required'),
  comments: z.string().min(1, 'Comments are required'),
});
