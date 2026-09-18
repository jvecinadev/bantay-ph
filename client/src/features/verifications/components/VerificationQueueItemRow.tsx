import { useNavigate } from "react-router-dom";
import useClaimVerificationMutation from "../hooks/useClaimVerificationMutation";
import type { VerificationQueueItem } from "../types";
import VerificationQueueItemCard from "./VerificationQueueItemCard";

type Props = {
  item: VerificationQueueItem;
  canClaim: boolean;
};

const VerificationQueueItemRow = ({ item, canClaim }: Props) => {
  const navigate = useNavigate();
  const claimMutation = useClaimVerificationMutation(item.id);

  const onClaim = async () => {
    await claimMutation.mutateAsync();
    navigate(`/reports/${item.id}`); 
  };

  return (
    <VerificationQueueItemCard
      item={item}
      canClaim={canClaim}
      isClaiming={claimMutation.isPending}
      onClaim={onClaim}
    />
  );
};

export default VerificationQueueItemRow;