const ApplicantDetails = ({ data } : {data: any}) => {
  //Convert the data into something more readable
  const date = new Date(data.data.applicator.joinedAt)
return (
<main>
  <div className="bg-secondary px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
    <dt className="text-lg font-bold font-['Montserrat']  text-gray-900">
        Nome: {/** Name*/}
    </dt>
    <dd id="name" className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0 ">
    {data.data.applicator.firstName} {data.data.applicator.lastName}
    </dd>
  </div>

    <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
        <dt className="text-lg font-bold font-['Montserrat']  text-gray-900">
            E-mail: 
        </dt>
        <dd id="email" className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2">
          Mail {/* {data.data.applicator.email} */}
        </dd>
    </div>
      <div className="bg-secondary px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
          <dd className="text-lg font-bold font-['Montserrat'] text-gray-900">
          Enviado em: {/* Applied at*/}
          </dd>
          <dd id="date" className="mt-1 text-lg font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2">
              {date.toString()}
          </dd>
      </div>
      <div className="bg-white px-4 py-3 sm:grid grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
          <dt className="text-lg font-bold font-['Montserrat'] text-gray-900">
          Motivação: {/* Motivation*/}
          </dt>
      <div>
      <dd id="motivation" className="mt-1 whitespace-normal text-lg font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2 text-ellipsis">
          {data.data.application.motivation}
      </dd>
    </div>   
  </div>
</main>
  );
};

export default ApplicantDetails;
