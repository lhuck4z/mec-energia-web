import { Paper } from "@mui/material";
import { CardWrapperProps } from "@/types/app";

const CardWrapper = ({
  selected,
  dense,
  variant = "default",
  children,
}: CardWrapperProps) => (
  <Paper
    sx={{
      padding: 2,
      position: "relative",
      boxShadow: "24dp",

      ...(dense
        ? {
            minWidth: "208px",
            minHeight: "108px",
          }
        : {
            width: "240px",
            height: "152px",
          }),

      ...(variant === "warning" && {
        backgroundColor: "warning.main",
      }),

      ...(variant === "disabled" && {
        backgroundColor: "background.default",
      }),
    }}
    {...(variant === "disabled" && {
      variant: "outlined",
    })}
    {...(selected && {
      variant: "elevation",
      elevation: 8,
    })}
  >
    {children}
  </Paper>
);

export default CardWrapper;
