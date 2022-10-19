import { useDispatch, useSelector } from "react-redux";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import {
  selectIsConsumerUnitCreateFormOpen,
  setIsConsumerUnitCreateFormOpen,
} from "../../../store/appSlice";
import FormDrawer from "../../Form/Drawer";
import TextFieldFormController from "../../Form/TextField";
import SelectFormController from "../../Form/Select";
import { getDate, toDate } from "date-fns";

interface FormData {
  title: string;
  code: string;
  supplier: string;
  startDate: Date | string;
  supplied: number | "";
  tariffType: string;
  contracted: number | "";
}

const ConsumerUnitCreateForm = () => {
  const dispatch = useDispatch();
  const isCreateFormOpen = useSelector(selectIsConsumerUnitCreateFormOpen);

  const form = useForm<FormData>();

  const {
    control,
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmitHandler: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  const handleCloseDrawer = () => {
    reset();
    dispatch(setIsConsumerUnitCreateFormOpen(false));
  };

  return (
    <FormDrawer open={isCreateFormOpen} handleCloseDrawer={handleCloseDrawer}>
      <FormProvider {...form}>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">
                Adicionar Unidade Consumidora
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldFormController
                name="title"
                label="Nome"
                helperText="Ex.: Campus Gama, Biblioteca, Faculdade de Medicina"
                rules={{ required: "Campo obrigatório" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldFormController
                name="code"
                label="Código"
                helperText="Número da Unidade Consumidora conforme a fatura"
                rules={{ required: "Campo obrigatório" }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Contrato</Typography>
            </Grid>

            <Grid item xs={12}>
              <SelectFormController
                name="supplier"
                label="Distribuidora"
                rules={{ required: "Campo obrigatório" }}
                options={[
                  { id: "a", label: "Distribuidora A" },
                  { id: "b", label: "Distribuidora B" },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="startDate"
                defaultValue=""
                rules={{ required: "Campo obrigatório" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    value={value}
                    views={["year", "month"]}
                    openTo="year"
                    label="Início da vigência"
                    minDate={new Date("2010")}
                    disableFuture
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={errors["startDate"]?.message ?? " "}
                        error={!!errors["startDate"]}
                      />
                    )}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>

            <Grid item xs={8} md={6}>
              <TextFieldFormController
                name="supplied"
                label="Tensão de fornecimento"
                rules={{ required: "Campo obrigatório" }}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kV</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="tariffType"
                defaultValue=""
                rules={{ required: "Campo obrigatório" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl error={!!error}>
                    <FormLabel>Modalidade tarifária</FormLabel>

                    <RadioGroup value={value} row onChange={onChange}>
                      <FormControlLabel
                        value="green"
                        control={<Radio />}
                        label="Verde"
                      />
                      <FormControlLabel
                        value="blue"
                        control={<Radio />}
                        label="Azul"
                      />
                    </RadioGroup>

                    <FormHelperText>{error?.message ?? " "}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={8} md={6}>
              <TextFieldFormController
                name="contracted"
                label="Demanda contratada"
                rules={{ required: "Campo obrigatório" }}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kV</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Gravar
              </Button>

              <Button variant="text" onClick={handleCloseDrawer}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </FormDrawer>
  );
};

export default ConsumerUnitCreateForm;
