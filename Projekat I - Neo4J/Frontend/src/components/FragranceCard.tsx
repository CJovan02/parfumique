import { Link } from "react-router-dom";
import { base64ToUrl } from "../utils";
import { FragranceCardProps } from "../dto-s/Props";
import FragranceActions from "./FragranceActions";

const FragranceCard: React.FC<FragranceCardProps> = ({
  id,
  image,
  name,
  gender,
  onProfile,
}) => {
  return (
    <div className="grid gap-4 w-full">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-56">
          <a href="#">
            <img
              className="mx-auto h-full rounded-xl"
              src={base64ToUrl(image)}
              alt={`${name} image`}
            />
          </a>
        </div>

        <div className="flex items-center h-12 justify-center">
          <Link
            to={`/fragrances/${id}`}
            className="text-lg text-center font-semibold leading-tight my-text-black"
          >
            {`${name} for ${gender}`}
          </Link>
        </div>
        {!onProfile && <FragranceActions id={Number(id)} />}
      </div>
    </div>
  );
};

export default FragranceCard;
