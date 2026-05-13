import Form from '../components/Form';

const CreateCompany = () => {
  return (
    <div className="mx-auto max-w-5xl px-0 py-2 sm:py-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Create Company</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Set up your company profile to start posting jobs</p>
        </div>
      </div>
      <Form />
    </div>
  );
};

export default CreateCompany;
