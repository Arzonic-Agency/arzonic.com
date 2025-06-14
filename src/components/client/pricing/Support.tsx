import React from "react";
import { FaBuildingShield, FaCheck, FaGlobe, FaHeadset } from "react-icons/fa6";

const Support = () => {
  return (
    <div className="card lg:card-side bg-base-100 shadow-sm md:flex-row flex-col-reverse">
      <figure className="md:w-1/2">
        <div className="flex items-center justify-center gap-10">
          <div className="">
            <FaBuildingShield size={100} />
          </div>
          <div className="flex flex-col justify-center items-center gap-14">
            <FaGlobe size={100} />
            <FaHeadset size={100} />
          </div>
        </div>
      </figure>
      <div className="card-body gap-7 ">
        <h2 className="card-title text-2xl">
          Vi tager os af driften – så du kan fokusere på forretningen
        </h2>
        <ul className="flex flex-col gap-6">
          <li className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold flex items-center gap-1">
              <FaCheck /> Hosting & domæneadministration
            </h3>
            <p className="text-zinc-400 text-sm w-4/5">
              Vi sørger for, at dit website er online, hurtigt og pålideligt. Du
              slipper for at tænke på teknisk opsætning, fornyelse af domæner og
              serverdrift.
            </p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold flex items-center gap-1">
              <FaCheck />
              Backup & sikkerhedsopdateringer
            </h3>
            <p className="text-zinc-400 text-sm w-4/5">
              Din løsning bliver løbende opdateret og sikkerhedskopieret. Vi
              overvåger, vedligeholder og sikrer, at alt fungerer trygt og
              stabilt – altid.
            </p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold flex items-center gap-1">
              <FaCheck />
              Mindre ændringer & support
            </h3>
            <p className="text-zinc-400 text-sm w-4/5">
              Du får adgang til løbende support og hjælp til småjusteringer –
              hvad end det er opdatering af indhold eller mindre tilpasninger i
              funktionalitet.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Support;
