import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";
// import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import axios from "axios";
import { proxy } from "../proxy";
import { useSelector, useDispatch } from "react-redux";
import {
  readDailyUsage,
  insertDailyUsage,
  updateDailyUsage,
  deleteDailyUsage,
} from "../actions/dailyUsageActions";
import Loader from "./Loader";

const DailyUsage = () => {
  const dispatch = useDispatch();

  let dailyUsages = useSelector((state) => state.dailyUsage.dailyUsage);

  const [loading, setLoading] = useState(true);
  const [pageMAxSize, setPageMAxSize] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [id, setId] = useState("");

  const [schedule, setSchedule] = useState("");
  const [coachNo, setCoachNo] = useState("");
  const [coachType, setCoachType] = useState("");
  const [site, setSite] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateOfInspection, setDateOfInspection] = useState("");
  const [daysTakenForFtWork, setDaysTakenForFtWork] = useState(0);
  const [slNoAsPerLoa, setSlNoAsPerLoa] = useState(0);
  const [description, setDescription] = useState("");
  const [partNo, setPartNo] = useState("");
  const [qty, setQty] = useState(0);
  const [qpc, setQpc] = useState(0);
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [descriptionSuggestions, setDescriptionSuggestions] = useState([]);

  useEffect(async () => {
    /**get invoiceDetails */
    axios
      .get(`${proxy}/api/invoice-details/onlyDescription`)
      .then((response) => {
        let x = [];
        response.data.forEach((one) => {
          x.push(one.itemDescription);
        });

        var uniqDescriptionArray = x.reduce(function (a, b) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);
        setDescriptionSuggestions(uniqDescriptionArray);
      });
    let yr = new Date().getFullYear();
    let x = new Date().getMonth() + 1;
    let mn = x < 10 ? "0" + x : x;
    let dt =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    setStartDate(mn + "/" + dt + "/" + yr);
    setEndDate(mn + "/" + dt + "/" + yr);
    setDateOfInspection(mn + "/" + dt + "/" + yr);
    setLoading(true);
    let response = await axios.get(`${proxy}/api/daily-usage/`);
    setLoading(false);
    dispatch(readDailyUsage(response.data));
  }, []);

  const handleInsertDailyUsage = async () => {
    if (allFieldsAreFilled("save")) {
      let insertData = {
        schedule,
        coachNo,
        coachType,
        site,
        startDate,
        endDate,
        dateOfInspection,
        daysTakenForFtWork,
        slNoAsPerLoa,
        description,
        partNo,
        qty,
        qpc,
        location: location.trim(),
        remarks,
      };
      /**set data */
      setLoading(true);
      let response = await axios.post(`${proxy}/api/daily-usage`, insertData);
      setLoading(false);
      alert("saved!");
      setOpenForm(false);
      dispatch(insertDailyUsage(response.data));
    } else {
      setLoading(false);
      alert("Please Fill All Field");
    }
  };

  const allFieldsAreFilled = (type) => {
    if (type == "save") {
      if (
        schedule == "" ||
        coachNo == "" ||
        coachType == "" ||
        site == "" ||
        daysTakenForFtWork == 0 ||
        slNoAsPerLoa == 0 ||
        description == "" ||
        partNo == "" ||
        qty == 0 ||
        qpc == 0 ||
        location == "" ||
        remarks == ""
      ) {
        return false;
      }
      return true;
    } else {
      if (
        id == "" ||
        schedule == "" ||
        coachNo == "" ||
        coachType == "" ||
        site == "" ||
        daysTakenForFtWork == 0 ||
        slNoAsPerLoa == 0 ||
        description == "" ||
        partNo == "" ||
        qty == 0 ||
        qpc == 0 ||
        location == "" ||
        remarks == ""
      ) {
        return false;
      }
      return true;
    }
  };

  const setDataForUpdate = (rowData) => {
    setOpenForm(true);
    setId(rowData._id);
    setSchedule(rowData.schedule);
    setCoachNo(rowData.coachNo);
    setCoachType(rowData.coachType);
    setSite(rowData.site);
    setStartDate(rowData.startDate);
    setEndDate(rowData.endDate);
    setDateOfInspection(rowData.dateOfInspection);
    setDaysTakenForFtWork(rowData.daysTakenForFtWork);
    setSlNoAsPerLoa(rowData.slNoAsPerLoa);
    setDescription(rowData.description);
    setPartNo(rowData.partNo);
    setQty(rowData.qty);
    setQpc(rowData.qpc);
    setLocation(rowData.location);
    setRemarks(rowData.remarks);
  };

  const handleUpdateDailyUsage = async () => {
    if (allFieldsAreFilled("update")) {
      let updateData = {
        schedule,
        coachNo,
        coachType,
        site,
        startDate,
        endDate,
        dateOfInspection,
        daysTakenForFtWork,
        slNoAsPerLoa,
        description,
        partNo,
        qty,
        qpc,
        location: location.trim(),
        remarks,
      };
      /**set updated data */
      setLoading(true);
      let response = await axios.put(
        `${proxy}/api/daily-usage/${id}`,
        updateData
      );
      setLoading(false);
      alert("Updated!");
      setOpenForm(false);

      response = await axios.get(`${proxy}/api/daily-usage`);
      dispatch(readDailyUsage(response.data));
    } else {
      setLoading(false);
      alert("Please Fill All Field");
    }
  };

  const handleDeleteDailyUsage = async (id) => {
    setLoading(true);
    await axios.delete(`${proxy}/api/daily-usage/${id}`);
    setLoading(false);
    alert("Deleted!");
    setOpenForm(false);
    dispatch(deleteDailyUsage(id));
  };

  const renderColumns = () => {
    return [
      { title: "Schedule", field: "schedule" },
      { title: "Coach No", field: "coachNo" },
      { title: "Coach Type", field: "coachType" },
      { title: "Site", field: "site" },
      { title: "Start Date", field: "startDate" },
      { title: "End Date", field: "endDate" },
      { title: "Date of Inspection", field: "dateOfInspection" },
      { title: "Day for Ft work", field: "daysTakenForFtWork" },
      { title: "SL NO AS PER LOA", field: "slNoAsPerLoa" },
      { title: "Description", field: "description" },
      { title: "Part No", field: "partNo" },
      { title: "QTY", field: "qty" },
      { title: "QPC", field: "qpc" },
      { title: "Location", field: "location" },
      { title: "Remarks", field: "remarks" },
      { title: "Price", field: "price" },
    ];
  };

  const renderData = () => {
    return dailyUsages.length > 0
      ? dailyUsages.map((dailyUsage) => {
          return {
            schedule: dailyUsage.schedule,
            coachNo: dailyUsage.coachNo,
            coachType: dailyUsage.coachType,
            site: dailyUsage.site,
            startDate: dailyUsage.startDate,
            endDate: dailyUsage.endDate,
            dateOfInspection: dailyUsage.dateOfInspection,
            daysTakenForFtWork: dailyUsage.daysTakenForFtWork,
            slNoAsPerLoa: dailyUsage.slNoAsPerLoa,
            description: dailyUsage.description,
            partNo: dailyUsage.partNo,
            qty: dailyUsage.qty,
            qpc: dailyUsage.qpc,
            location: dailyUsage.location,
            remarks: dailyUsage.remarks,
            price: dailyUsage.price,
            _id: dailyUsage._id,
          };
        })
      : [];
  };

  const renderActions = () => {
    return [
      (rowData) => ({
        icon: "edit",
        tooltip: "Edit daily Usage",
        onClick: () => setDataForUpdate(rowData),
      }),
      (rowData) => ({
        icon: "delete",
        tooltip: "Delete daily Usage",
        onClick: () => handleDeleteDailyUsage(rowData._id),
      }),
    ];
  };

  const renderOptions = () => {
    return {
      actionsColumnIndex: -1,
      pageSize: pageMAxSize,
    };
  };

  const handleClose = () => {
    setOpenForm(false);
    handleClear();
  };

  const handleClear = () => {
    let yr = new Date().getFullYear();
    let x = new Date().getMonth() + 1;
    let mn = x < 10 ? "0" + x : x;
    let dt =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();

    setStartDate(mn + "/" + dt + "/" + yr);
    setEndDate(mn + "/" + dt + "/" + yr);
    setDateOfInspection(mn + "/" + dt + "/" + yr);

    setId("");
    setSchedule("");
    setCoachNo("");
    setCoachType("");
    setSite("");

    setDaysTakenForFtWork(0);
    setSlNoAsPerLoa(0);
    setDescription("");
    setPartNo("");
    setQty(0);
    setQpc(0);
    setLocation("");
    setRemarks("");
  };

  const handleChangeStartDate = (date) => {
    let dt = date.getDate();
    let mn = date.getMonth() + 1;
    let yr = date.getFullYear();
    setStartDate(mn + "/" + dt + "/" + yr);
  };
  const handleChangeEndDate = (date) => {
    let dt = date.getDate();
    let mn = date.getMonth() + 1;
    let yr = date.getFullYear();
    setEndDate(mn + "/" + dt + "/" + yr);
  };
  const handleChangeDateOfInspection = (date) => {
    let dt = date.getDate();
    let mn = date.getMonth() + 1;
    let yr = date.getFullYear();
    setDateOfInspection(mn + "/" + dt + "/" + yr);
  };

  return (
    <Grid container direction="column">
      {console.log("render")}
      <Grid
        style={{
          padding: "10px",
          margin: "5px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            handleClear();
            setOpenForm(true);
          }}
        >
          Add Details
        </Button>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={openForm}
      >
        {loading ? <Loader /> : ""}
        <DialogTitle id="simple-dialog-title">
          <center>Add Daily Consumption Detail</center>
        </DialogTitle>
        <Divider />

        <FormControl>
          <InputLabel
            id="schedule"
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
          >
            Schedule
          </InputLabel>
          <Select
            disabled={id ? true : false}
            labelId="schedule"
            id="select"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
          >
            <MenuItem value={"QTR"}>QTR</MenuItem>
            <MenuItem value={"BDM"}>BDM</MenuItem>
            <MenuItem value={"OVH-36M"}> OVH - 36M</MenuItem>
            <MenuItem value={"OVH-72M"}> OVH - 72M</MenuItem>
            <MenuItem value={"OVH-108M"}> OVH - 108M</MenuItem>
          </Select>
        </FormControl>
        <TextField
          disabled={id ? true : false}
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          variant="standard"
          value={coachNo}
          onChange={(e) => setCoachNo(e.target.value)}
          label="Coach No"
        />
        <FormControl>
          <InputLabel
            id="coachType"
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
          >
            Coach Type
          </InputLabel>
          <Select
            disabled={id ? true : false}
            labelId="coachType"
            id="select"
            value={coachType}
            onChange={(e) => setCoachType(e.target.value)}
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
          >
            <MenuItem value={"EOG"}>EOG</MenuItem>
            <MenuItem value={"PC"}>PC</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel
            id="site"
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
          >
            Site
          </InputLabel>
          <Select
            disabled={id ? true : false}
            labelId="site"
            id="select"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
          >
            <MenuItem value={"SDAH"}>SDAH</MenuItem>
            <MenuItem value={"TKPR"}>TKPR</MenuItem>
            <MenuItem value={"LLH"}>LLH</MenuItem>
            <MenuItem value={"KOAA"}>KOAA</MenuItem>
            <MenuItem value={"SAYE"}>SAYE</MenuItem>
            <MenuItem value={"BGP"}>BGP</MenuItem>
          </Select>
        </FormControl>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
            margin="normal"
            id="date-picker-dialog-1"
            label="Start Date"
            format="MM/dd/yyyy"
            value={startDate}
            onChange={(date) => handleChangeStartDate(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
            margin="normal"
            id="date-picker-dialog-1"
            label="End Date"
            format="MM/dd/yyyy"
            value={endDate}
            onChange={(date) => handleChangeEndDate(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              marginBottom: "4px",
            }}
            margin="normal"
            id="date-picker-dialog"
            label="Inspection Date"
            format="MM/dd/yyyy"
            value={dateOfInspection}
            onChange={(date) => handleChangeDateOfInspection(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>

        <TextField
          disabled={id ? true : false}
          type={Number}
          disabled={id ? true : false}
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          variant="standard"
          value={daysTakenForFtWork}
          onChange={(e) => setDaysTakenForFtWork(e.target.value)}
          label="Day For Ft Work"
        />
        <TextField
          type={Number}
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          disabled={id ? true : false}
          variant="standard"
          value={slNoAsPerLoa}
          onChange={(e) => setSlNoAsPerLoa(e.target.value)}
          label="SL NO AS PER LOA"
        />
        <Autocomplete
          disabled={id ? true : false}
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          onInputChange={(event, value) => {
            setDescription(value);
          }}
          id="free-solo-2-demo"
          disableClearable
          options={descriptionSuggestions.map((option) => option)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Description"
              margin="normal"
              variant="standard"
              InputProps={{ ...params.InputProps, type: "search" }}
            />
          )}
        />
        <TextField
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          disabled={id ? true : false}
          variant="standard"
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
          label="Part No"
        />
        <TextField
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          type={Number}
          disabled={id ? true : false}
          variant="standard"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          label="Quantity"
        />
        <TextField
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          type={Number}
          disabled={id ? true : false}
          variant="standard"
          value={qpc}
          onChange={(e) => setQpc(e.target.value)}
          label="Qpc"
        />
        <TextField
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          variant="standard"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          label="Location(example. 1,2,3,4)"
        />
        <TextField
          style={{
            marginLeft: "30%",
            marginRight: "30%",
            marginBottom: "4px",
          }}
          disabled={id ? true : false}
          variant="standard"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          label="Remarks"
        />

        <center>
          {id != "" ? (
            <Button
              variant="outlined"
              color="primary"
              style={{ marginBottom: "5px" }}
              onClick={() => handleUpdateDailyUsage()}
            >
              UPDATE
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              style={{ marginBottom: "5px" }}
              onClick={() => handleInsertDailyUsage()}
            >
              SAVE
            </Button>
          )}
        </center>
      </Dialog>

      <Grid
        style={{
          padding: "10px",
          margin: "5px",
        }}
      >
        <MaterialTable
          title="Daily Consumption"
          columns={renderColumns()}
          data={renderData()}
          actions={renderActions()}
          options={renderOptions()}
        />
      </Grid>
    </Grid>
  );
};
export default DailyUsage;
