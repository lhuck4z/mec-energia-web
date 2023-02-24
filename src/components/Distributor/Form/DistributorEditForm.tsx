import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveDistributorId, selectIsDistributorEditFormOpen, setIsDistributorEditFormOpen, setIsErrorNotificationOpen, setIsSuccessNotificationOpen } from '../../../store/appSlice';
import { EditDistributorForm, EditDistributorRequestPayload } from '../../../types/distributor';
import FormDrawer from '../../Form/Drawer';
import { PatternFormat } from 'react-number-format';

import {
  Controller, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import { Box, Button, FormControlLabel, FormGroup, FormHelperText, Grid, Switch, TextField, Typography } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FormWarningDialog from '../../ConsumerUnit/Form/WarningDialog';
import { useEditDistributorMutation, useGetDistributorQuery } from '@/api';
import { useSession } from 'next-auth/react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { SubmitButton } from '@/components/Form/SubmitButton';
import { FormErrorsAlert } from '@/components/Form/FormErrorsAlert';


const defaultValues: EditDistributorForm = {
  isActive: true,
  name: "",
  cnpj: "",
};

const DistributorEditForm = () => {
  const user = useSession().data?.user;
  const dispatch = useDispatch();
  const activeDistributor = useSelector(selectActiveDistributorId);
  const isEditFormOpen = useSelector(selectIsDistributorEditFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [editDistributor, { isError, isSuccess, isLoading }] = useEditDistributorMutation()
  const { data: distributor } = useGetDistributorQuery(activeDistributor || skipToken)
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = form;

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  const isActive = watch("isActive")

  useEffect(() => {
    if (isEditFormOpen && distributor) {
      const { name, isActive, cnpj } = distributor
      setValue('name', name)
      setValue('cnpj', cnpj)
      setValue('isActive', isActive)
    }
  }, [distributor, isEditFormOpen, setValue])

  useEffect(() => {
    setValue("isActive", isActive)
  }, [isActive, setValue])

  const handleDiscardForm = () => {
    handleCloseDialog();
    reset();
    dispatch(setIsDistributorEditFormOpen(false));
  };

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<EditDistributorForm> = async (data) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, '');
    data.cnpj = cnpjSemMascara
    const body: EditDistributorRequestPayload = {
      id: activeDistributor as number,
      name: data.name,
      cnpj: data.cnpj,
      isActive: data.isActive,
      university: user?.universityId as number
    }
    await editDistributor(body)
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(setIsSuccessNotificationOpen({
        isOpen: true,
        text: "Distribuidora modificada com sucesso!"
      }))
      reset();
      dispatch(setIsDistributorEditFormOpen(false))
    }
    else if (isError)
      dispatch(setIsErrorNotificationOpen({
        isOpen: true,
        text: "Erro ao editar distribuidora."
      }))
  }, [dispatch, isError, isSuccess, reset])

  useEffect(() => {
    handleNotification()
  }, [handleNotification, isSuccess, isError])

  //Validações

  const hasEnoughCaracteresLength = (value: EditDistributorForm['name']) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres"
    return true
  }

  return (
    <FormDrawer open={isEditFormOpen} handleCloseDrawer={handleCancelEdition}>
      <FormProvider {...form}>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Typography variant="h4">
                Editar Distribuidora
              </Typography>
              <Typography>
                * campos obrigatórios
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Campo obrigatório",
                  validate: hasEnoughCaracteresLength
                }}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <TextField
                    ref={ref}
                    value={value}
                    label="Nome"
                    required
                    error={Boolean(error)}
                    helperText={error?.message ?? " "}
                    fullWidth
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="cnpj"
                rules={{
                  required: "Preencha este campo",
                  pattern: {
                    value: /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})/,
                    message: "Insira um CNPJ válido com 14 dígitos"
                  }
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <PatternFormat
                    value={value}
                    customInput={TextField}
                    label="CNPJ"
                    format='##.###.###/####-##'
                    required
                    error={Boolean(error)}
                    helperText={error?.message ?? " "}
                    fullWidth
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormGroup>
                    <Box display='flex' justifyContent='flex-start' alignItems='center'>
                      <FlashOnIcon color='primary' />
                      {distributor && (
                        <FormControlLabel
                          label="Distribuidora ativa"
                          labelPlacement='start'
                          sx={{ width: '38%', margin: 0 }}
                          control={
                            <Box>
                              <Switch
                                value={value}
                                defaultChecked={distributor.isActive}
                                onChange={onChange}

                              />
                            </Box>
                          }
                        />
                      )}
                    </Box>

                    <FormHelperText>
                      <p>Só distribuidoras ativas permitem gerar recomendações para as unidades consumidoras relacionadas.</p>
                      <p>Apenas as distribuidoras que não estão relacionadas à nenhuma unidade consumidora podem ser excluídas.</p>
                    </FormHelperText>
                  </FormGroup>
                )}
              />
            </Grid>

            <FormErrorsAlert hasErrors={Object.keys(errors).length > 0 ? true : false} />

            <Grid item xs={12}>
              <SubmitButton isLoading={isLoading} />

              <Button variant="text" onClick={handleCancelEdition} size='large'>
                <Typography pl={3} pr={3}>Cancelar</Typography>
              </Button>
            </Grid>
          </Grid>

          <FormWarningDialog
            open={shouldShowCancelDialog}
            entity={'distribuidora'}
            onClose={handleCloseDialog}
            onDiscard={handleDiscardForm}
          />

        </Box>
      </FormProvider>
    </FormDrawer>
  )
}

export default DistributorEditForm;
