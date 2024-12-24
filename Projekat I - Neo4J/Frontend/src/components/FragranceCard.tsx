import { Link } from "react-router-dom";
import { base64ToUrl } from "../utils";

interface FragraceCardProps {
  id: string;
  image: string;
  name: string;
  gender: string;
}

const FragranceCard: React.FC<FragraceCardProps> = ({
  id,
  image,
  name,
  gender,
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
      </div>
    </div>
  );
};

export default FragranceCard;
