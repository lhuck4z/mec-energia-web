import { Badge, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';
import React, { Fragment, useEffect, useState } from 'react'
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { selectCurrentTariff } from '@/store/appSlice';

export const TariffTable = () => {

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [overdue, setOverdue] = useState(false)
  const currentTariff = useSelector(selectCurrentTariff)

  const formatDate = () => {
    if (currentTariff) {
      if (currentTariff.start_date === '') setStartDate('')
      else {
        setStartDate(format(new Date(currentTariff.start_date), "dd'/'MM'/'yyyy"))
        setOverdue(currentTariff.overdue)
      }
    } else setStartDate('')
    if (currentTariff) {
      if (currentTariff.end_date === '') setEndDate('')
      else {
        setEndDate(format(new Date(currentTariff.end_date), "dd'/'MM'/'yyyy"))
        setOverdue(currentTariff.overdue)
      }
    } else {
      setStartDate('')
      setOverdue(false)
    }
  }

  useEffect(() => {
    formatDate()
  }, [currentTariff])

  return (
    <Box width={'100%'}>
      <Box display='flex' mt={2} width='35%' justifyContent={'space-between'}>
        <Box display='flex' flexDirection='column' >
          <Typography sx={{ color: 'text.secondary' }}>
            Inicio
          </Typography>
          <Typography>
            {startDate}
          </Typography>
        </Box>
        <Box display='flex' justifyContent='center' alignItems='center'>
          {overdue === true && <Badge color="secondary" badgeContent={'!'}></Badge>}
          <Box ml={4} display='flex' flexDirection='column'>
            <Typography sx={{ color: 'text.secondary' }}>
              Fim
            </Typography>
            <Typography>
              {endDate}
            </Typography>
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <TableHead >
            <TableRow sx={{ background: '#555555' }}>
              <TableCell sx={{ borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: '#fff', color: '#fff' }} align='center'>Posto</TableCell>
              <TableCell sx={{ borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: '#fff', color: '#fff' }} align='center'>Modalidade</TableCell>
              <TableCell sx={{ borderStyle: 'solid', borderWidth: '0 1px 0 0', borderColor: '#fff', color: '#fff' }}>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='30%'>
                    <Typography>
                      TUSD
                    </Typography>
                    <Tooltip title="Tarifa de uso do sistema de distribuição">
                      <InfoIcon />
                    </Tooltip>
                  </Box>
                  <Box display='flex' justifyContent='space-between' width='80%'>
                    <Box>
                      R$/kW
                    </Box>
                    <Box>
                      R$/MWh
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ color: '#fff' }}>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='30%'>
                    <Box>TE</Box>
                    <Tooltip title="Tarifa de energia">
                      <InfoIcon />
                    </Tooltip>
                  </Box>
                  <Box>R$/MWh</Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Fragment>
              <TableRow sx={{ background: '#999999' }}>
                <TableCell rowSpan={3} align='center' sx={{ color: '#fff' }}> Azul</TableCell>
              </TableRow>
              <TableRow sx={{ background: '#EEEEEE' }}>
                <TableCell align='center'> Ponta</TableCell>
                <TableCell>
                  <Box display='flex' justifyContent='space-between' width='80%' m='0 auto'>
                    <Box>{currentTariff.blue.peak_tusd_in_reais_per_kw}</Box>
                    <Box>{currentTariff.blue.peak_tusd_in_reais_per_mwh}</Box>
                  </Box>
                </TableCell>
                <TableCell align='center'>{currentTariff.blue.peak_te_in_reais_per_mwh}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'> Fora Ponta</TableCell>
                <TableCell>
                  <Box display='flex' justifyContent='space-between' width='80%' m='0 auto'>
                    <Box>{currentTariff.blue.off_peak_tusd_in_reais_per_kw}</Box>
                    <Box>{currentTariff.blue.off_peak_tusd_in_reais_per_mwh}</Box>
                  </Box>
                </TableCell>
                <TableCell align='center'>{currentTariff.blue.off_peak_te_in_reais_per_mwh}</TableCell>
              </TableRow>
            </Fragment>
            <Fragment>
              <TableRow sx={{ background: '#999999' }}>
                <TableCell rowSpan={4} align='center' sx={{ color: '#fff' }}>Verde</TableCell>
              </TableRow>
              <TableRow sx={{ background: '#EEEEEE' }}>
                <TableCell align='center'> NA</TableCell>
                <TableCell>
                  <Box display='flex' justifyContent='space-between' width='80%' m='0 auto'>
                    <Box>{currentTariff.green.na_tusd_in_reais_per_kw}</Box>
                    <Box> - </Box>
                  </Box>
                </TableCell>
                <TableCell align='center'> - </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>Ponta</TableCell>
                <TableCell>
                  <Box display='flex' justifyContent='space-between' width='80%' m='0 auto'>
                    <Box> - </Box>
                    <Box>{currentTariff.green.peak_tusd_in_reais_per_mwh}</Box>
                  </Box>
                </TableCell>
                <TableCell align='center'>{currentTariff.green.peak_te_in_reais_per_mwh}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'> Fora Ponta</TableCell>
                <TableCell>
                  <Box display='flex' justifyContent='space-between' width='80%' m='0 auto'>
                    <Box> - </Box>
                    <Box> {currentTariff.green.off_peak_tusd_in_reais_per_mwh} </Box>
                  </Box>
                </TableCell>
                <TableCell align='center'>{currentTariff.green.off_peak_te_in_reais_per_mwh}</TableCell>
              </TableRow>
            </Fragment>
          </TableBody>
        </Table>
      </TableContainer>



    </Box >
  )
}
