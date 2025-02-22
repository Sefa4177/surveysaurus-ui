import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "../style/FillSurvey.scss";
import EmtyCircle from "../image/emptyCircle.png";
import axios from "axios";
import Menu from "../components/Menu";
import CircleCheck from "../image/circleCheck.svg";
import World from "../image/world.png";
import { useNavigate } from "react-router-dom";
import Face from "../image/face.png";
import Gif from "../image/gif.png";
import Header from "../image/header.png";
import Italic from "../image/italic.png";
import Link1 from "../image/link.png";
import NumberedList from "../image/numberedList.png";
import bold from "../image/bold.png";
import bulletList from "../image/bulletList.png";
import UpVote from "../image/arrow.png";
import Reply from "../image/reply.png";
import Report from "../image/report.png";
import FullReport from "../image/reportfull.png";
import FullUpvote from "../image/upvotefull.png";
import DeleteIcon from "../image/delete-icon.png";
import { Link } from 'react-router-dom';

function FillSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const [control, setControl] = useState(false);
  const [selected, setSelected] = useState(null);
  const [surveyPercentData, setSurveyPercentData] = useState([]);
  const [topNumber, setTopNumber] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [addButtonControl, setAddButtonControl] = useState(false);
  const [surveyCommentData, setSurveyCommentData] = useState([]);
  const [reportItem, setReportItem] = useState({});
  const [commentID, setCommentID] = useState(0);
  const [selectedReport, setSelectedReport] = useState(0);
  const [controlReportChild, setControlReportChild] = useState(false);
  const [limit, setLimit] = useState(600);
  const [limitItem, setLimitItem] = useState(0);
  const [upvotedcomments, setUpvotedCommentsArray] = useState([]);
  const [upvotedcommentslist, setUpvotedCommentsArrayList] = useState([]);
  const [reportedComments, setReportedCommnetsArray] = useState([]);
  const [reportedCommentsList, setReportedCommnetsList] = useState([]);
  let now = new Date();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem("token")) {
      axios
        .post(
          "/api/survey/isfilled",
          {
            title: location.state.surveyInfo.title,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((result) => {
          setSelected(result.data.data.choice);
          console.log("filled");
          console.log(result);
        });
    }
    axios
      .post("/api/survey/getSurvey", {
        title: location.state.surveyInfo.title,
      })
      .then((result) => {
        let percentData = [];
        result.data.data.percent.map((item) => {
          percentData.push(item);
        });
        setSurveyPercentData(percentData);
      });

    setTimeout(() => {
      axios
        .post(
          "/api/comment/comments",
          {
            title: location.state.surveyInfo.title,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((result) => {
          let strupvoteds = ""
          let upvotedsArr = [];
          result.data.data.upvoteds.map((item) => {
            strupvoteds += item + ","
            upvotedsArr.push(item);
          });
          console.log("strupvoteds: " + strupvoteds)
          setUpvotedCommentsArray(upvotedsArr);
          //upvotedcomments = result.data.data.comments.filter(_comment=>_comment.upvoted).map(_comment=>_comment.commentID)
          let commentData = [];
          let counter = 0
          result.data.data.comments.map((item) => {
            counter++
            commentData.push(item);
          });
          setSurveyCommentData(commentData);
          let upvotedList = [];
          for (let i = 0; i < counter; i++) {
            upvotedList.push(strupvoteds)
          }
          console.log("1-------------: " + upvotedList)
          setUpvotedCommentsArrayList(upvotedList)

          let strReporteds = ""
          let ReportedsArr = [];
          result.data.data.reporteds.map((item) => {
            strReporteds += item + ","
            ReportedsArr.push(item);
          });
          console.log("strReporteds: " + strReporteds)
          setReportedCommnetsArray(ReportedsArr);
          let reportedList = [];
          for (let i = 0; i < counter; i++) {
            reportedList.push(strReporteds)
          }
          console.log("1-------------: " + reportedList)
          setReportedCommnetsList(reportedList)
          return;
        })
        

    }, 200);
  }, []);
  const handleDone = () => {
    console.log("dsadsa");
    if (selected === null) {
      alert("please choose an option");
    } else if (!localStorage.getItem("token")) {
      alert("Please login to fill out the survey.");
      localStorage.setItem("selectedOption", selected);
      navigate("/login", {
        state: {
          title: location.state.surveyInfo.title,
          item: location.state.surveyInfo,
        },
      });
    } else {
      axios
        .post(
          "/api/survey/fillSurvey",
          {
            title: location.state.surveyInfo.title,
            answer: selected,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((result) => {
          console.log(result);
          axios
            .post("/api/survey/getSurvey", {
              title: location.state.surveyInfo.title,
            })
            .then((result) => {
              let percentData = [];
              console.log(result);
              result.data.data.percent.map((item) => {
                percentData.push(item);
              });
              setSurveyPercentData(percentData);
            });
          setControl(true);
        })
        .catch((result) => {
          console.log(result);
        });
    }
  };
  const handleAddComment = () => {
    console.log(commentText);
    setCommentText("");
    if (commentText === "") {
      alert("please add a comment");
    } else if (!localStorage.getItem("token")) {
      alert("You must be logged in to add a comment");
      localStorage.setItem("commentText", commentText);
      localStorage.setItem("item", JSON.stringify(location.state.surveyInfo));
      if (commentID !== 0) {
        localStorage.setItem("commentID", commentID);
      }
      navigate("/login");
    } else if (commentID === 0) {
      axios.post(
        "/api/comment/addcomment",
        {
          title: location.state.surveyInfo.title,
          comment: commentText,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      setTimeout(() => {
        axios
          .post(
            "/api/comment/comments",
            {
              title: location.state.surveyInfo.title,
            },
            {
              headers: {
                authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((result) => {
            setSurveyCommentData([]);
            console.log("comments");
            console.log(result);
            let commentData = [];
            result.data.data.comments.map((item) => {
              commentData.push(item);
            });
            setSurveyCommentData(commentData);
            return;
          });
      }, 300);
      setAddButtonControl(false);
    } else if (commentID !== 0) {
      axios
        .post(
          "/api/comment/addcomment",
          {
            title: location.state.surveyInfo.title,
            comment: commentText,
            parentID: commentID,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((result) => {
          console.log("*****************");
          console.log(result);
          setCommentID(0);
        });

      setTimeout(() => {
        axios
          .post(
            "/api/comment/comments",
            {
              title: location.state.surveyInfo.title,
            },
            {
              headers: {
                authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((result) => {
            setSurveyCommentData([]);
            console.log("comments");
            console.log(result);
            let commentData = [];
            result.data.data.comments.map((item) => {
              commentData.push(item);
            });
            setSurveyCommentData(commentData);
            return;
          });
      }, 300);
      setAddButtonControl(false);
    }
  };
  const addButtonHandleClick = () => {
    setAddButtonControl(true);
  };
  const addCommentWithId = (item) => {
    setCommentID(item.commentID);
    window.scrollTo(0, 0);
    setAddButtonControl(true);
  };
  const handleReport = (item) => {
    if(!reportedComments.includes(item.commentID)){
      console.log(item)
      
      setSelectedReport(item.commentID);
      setReportItem({});
      setReportItem(item);
      setControlReportChild(!controlReportChild)
    }
    else{
      alert("You had reported this comment recently")
    }
    if(!reportedComments.includes(test.commentID)){
      console.log(test)
      
      setSelectedReport(test.commentID);
      setReportItem({});
      setReportItem(test);
      setControlReportChild(!controlReportChild)
    }
    else{
      alert("You had reported this comment recently")
    }
      
  };
  const handleYesButton = (item) => {
    if(!reportedComments.includes(item.commentID)){
      console.log(item);
    if (
      localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("auth")).name === item.author
    ) {
      alert("You cannot report your own comment.");
    } else if (localStorage.getItem("token")) {
      axios
        .post(
          "/api/comment/report",
          {
            commentID: item.commentID,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((result) => {
          axios
            .post(
              "/api/comment/comments",
              {
                title: location.state.surveyInfo.title,
              },
              {
                headers: {
                  authorization: localStorage.getItem("token"),
                },
              }
            )
            .then((result) => {
              let reportedsArr = [];
              result.data.data.reporteds.map((item) => {
                reportedsArr.push(item);
              });
              setReportedCommnetsArray(reportedsArr);
              setSurveyCommentData([]);
              console.log("comments");
              console.log(result);
              let commentData = [];
              result.data.data.comments.map((item) => {
                commentData.push(item);
              });
              setSurveyCommentData(commentData);
              let second = surveyCommentData.reduce(
                (partialSum, a) => partialSum + a,
                0
              );
              console.log("açıklama" + JSON.stringify(surveyCommentData));
              let reportedList = [];
              for (let i = 0; i < surveyCommentData.length; i++) {
                reportedList.push(reportedComments)
              }
              setReportedCommnetsList(reportedList)
              return;
            });
        });
    } else {
      alert("You must be logged in to add a report");
      navigate("/login");
    }
    }    
  };
  const handleUpVote = (item) => {
    console.log(item)
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to add a upvote");
      navigate("/login");
    } else {
      axios
        .post(
          "/api/comment/upVote",
          {
            commentID: item.commentID,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
          ////////////////////////////////////////////////////////////////////Hata Olabilir
        ).then((result) => {
        
          axios
            .post(
              "/api/comment/comments",
              {
                title: location.state.surveyInfo.title,
              },
              {
                headers: {
                  authorization: localStorage.getItem("token"),
                },
              }
            )
            .then((result) => {
              let upvotedsArr = [];
              result.data.data.upvoteds.map((item) => {
                upvotedsArr.push(item);
              });
              setUpvotedCommentsArray(upvotedsArr);
              setSurveyCommentData([]);
              console.log("comments");
              console.log(result);
              let commentData = [];
              result.data.data.comments.map((item) => {
                commentData.push(item);
              });
              setSurveyCommentData(commentData);
              let second = surveyCommentData.reduce(
                (partialSum, a) => partialSum + a,
                0
              );
              console.log("açıklama" + JSON.stringify(surveyCommentData));
              let upvotedList = [];
              for (let i = 0; i < surveyCommentData.length; i++) {
                upvotedList.push(upvotedcomments)
              }
              setUpvotedCommentsArrayList(upvotedList)
              return;
            });
        })
        .catch((result) => {
          console.log(result);
        });
    }
  };
  const handleDeleteComment = (item) => {
    axios
      .post(
        "/api/comment/delete",
        {
          commentID: item.commentID,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((result) => {
        console.log(result);
        axios
          .post(
            "/api/comment/comments",
            {
              title: location.state.surveyInfo.title,
            },
            {
              headers: {
                authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((result) => {
            setSurveyCommentData([]);
            console.log("comments");
            console.log(result);
            let commentData = [];
            result.data.data.comments.map((item) => {
              commentData.push(item);
            });
            setSurveyCommentData(commentData);
            return;
          });
      });
  };
  //child comment
  const recursive = (item) => {
    console.log("recursive yazdı-upvoted: ", upvotedcomments)
    console.log("recursive yazdı-reported: ", reportedComments)
    console.log("item.commentID: " + item.commentID)
    return (
      <ul style={{ width: "80%", display: "flex", flexDirection: "column" }}>
        {surveyCommentData.map((test) => {
          const testAuthor = test.author.split(" ");
          const itemDate = new Date(
            `${test.time.year}-${test.time.month}-${test.time.day} ${test.time.hour}:${test.time.minute}:${test.time.second}`
          );
          var distance = now.getTime() - itemDate.getTime();
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if (test.path.length > 1) {
            if (test.path[test.path.length - 2] === item.commentID) {
              return (
                <>
                  <div className="commentList">
                    <div className="userIcon">
                      {testAuthor.map((letter) => {
                        return (
                          <p style={{ fontSize: "15px", color: "white" }}>
                            {letter[0]}
                          </p>
                        );
                      })}
                    </div>
                    <div className="commentInfoContainer">
                      <div className="surveyInfo">
                        <p
                          style={{
                            marginRight: "10px",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                        >
                          {test.author}
                        </p>
                        <p>
                          {days >= 1 && days < 7
                            ? days + " days ago"
                            : days >= 7
                              ? Math.floor(days / 7) + " week ago"
                              : hours < 24 && hours >= 1
                                ? hours + " hours ago"
                                : minutes < 60 && minutes >= 1
                                  ? minutes + " minutes ago"
                                  : seconds < 60
                                    ? "a few seconds ago"
                                    : null}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                          {test.comment.substr(
                            0,
                            limitItem === test.commentID ? limit : 600
                          )}
                          <div
                            onClick={() => {
                              setLimitItem(test.commentID);
                              setLimit(test.comment.lenght);
                            }}
                            style={{
                              display:
                                test.comment.length > 600 && test.comment
                                  ? "block"
                                  : "none",
                              cursor: "pointer",
                              marginTop: "4px",
                              fontWeight: "bold",
                            }}
                          >
                            ...Read More
                          </div>
                        </p>
                      </div>

                      <div className="commentIconContainer">
                        <ul className="commentIconList">
                          <li
                            onClick={() => handleUpVote(test)}
                            className="commentListItem"
                          >
                            {upvotedcomments.includes(test.commentID) ? (
                                    <img src={FullUpvote}></img>
                                  ) : (
                                    <img src={UpVote}></img>
                                  )}
                            <p style={{ marginLeft: "5px" }}>
                              {test.upvote === 0 ? "UpVote" : test.upvote}
                            </p>
                          </li>
                          <li
                            onClick={() => addCommentWithId(test)}
                            className="commentListItem"
                          >
                            <img src={Reply}></img>
                            <p style={{ marginLeft: "5px" }}>Reply</p>
                          </li>
                          <li
                            onClick={() => {if(!reportedComments.includes(test.commentID)){
                              console.log(item)
                              
                              setSelectedReport(test.commentID);
                              setReportItem({});
                              setReportItem(test);
                              setControlReportChild(!controlReportChild)
                            }
                            else{
                              alert("You had reported this comment recently")
                            }}}
                            className="commentListItem"
                          >
                            {reportedComments.includes(test.commentID) ? (
                                    <img src={FullReport}></img>
                                  ) : (
                                    <img src={Report}></img>
                                  )}

                            <p style={{ marginLeft: "5px" }}>
                              { "Report"}
                            </p>

                            <div
                              style={{
                                display:
                                  selectedReport === test.commentID &&
                                    controlReportChild
                                    ? "flex"
                                    : "none",
                              }}
                              className="reportContainer"
                            >
                              <div>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "17px",
                                  }}
                                >
                                  Are you sure?
                                </p>
                              </div>
                              <div className="reportButtons">
                                <div
                                  onClick={() => handleYesButton(reportItem)}
                                  className="reportYes"
                                >
                                  <p>Yes</p>
                                </div>
                                <div className="reportNo">
                                  <p>No</p>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{
                              display:
                                localStorage.getItem("auth") &&
                                  JSON.parse(localStorage.getItem("auth"))
                                    .name === test.author
                                  ? "flex"
                                  : "none",
                            }}
                            onClick={() => handleDeleteComment(test)}
                            className="commentListItem"
                          >
                            <img width="15px" src={DeleteIcon}></img>
                            <p style={{ marginLeft: "5px" }}>Delete</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {recursive(test)}
                </>
              );
            }
          }
        })}
      </ul>
    );
  };
  //parent comment
  return (
    <div className="containerFill">
      <Menu isLogin={localStorage.getItem("auth") ? true : false} />
      {
        !addButtonControl && (
          <div className="Container">
            <div className="fillSurvey">
              <div className="questionPart">
                <label
                  style={{ marginLeft: "5px", fontSize: "16px" }}
                  htmlFor=""
                >
                  Question
                </label>
                <div className="optionsStyle">
                  <p className="optionText">
                    {location.state.surveyInfo.question}
                  </p>
                </div>
              </div>
              <div className="optionsPart">
                {!control && (
                  <div>
                    <label
                      style={{ marginLeft: "5px", fontSize: "16px" }}
                      htmlFor=""
                    >
                      Options
                    </label>
                    {location.state.surveyInfo.choices &&
                      location.state.surveyInfo.choices.map((item, index) => {
                        return (
                          <div
                            onClick={() => setSelected(index)}
                            className="optionsStyle"
                          >
                            <img
                              key={index}
                              style={{ marginLeft: "5px", marginBottom: "3px" }}
                              width="15px"
                              height="15px"
                              src={
                                selected === index ? CircleCheck : EmtyCircle
                              }
                              alt=""
                            />
                            <p className="optionText">{item}</p>
                          </div>
                        );
                      })}
                  </div>
                )}
                {control && (
                  <div>
                    <label
                      style={{ marginLeft: "5px", fontSize: "16px" }}
                      htmlFor=""
                    >
                      Rates
                    </label>
                    {surveyPercentData &&
                      surveyPercentData.length > 0 &&
                      surveyPercentData.map((item) => {
                        if (item > topNumber) {
                          setTopNumber(item);
                        } //item !== 0 ? {width:item*5}:{width:"50px"},item === topNumber ? {backgroundColor:"#E49192"}:null
                        return (
                          <div
                            className="ratesStyle"
                            style={{
                              width:
                                item !== 0
                                  ? item < 10
                                    ? item * 10
                                    : item * 7
                                  : "50px",
                              backgroundColor:
                                item === topNumber ? "#E49192" : null,
                            }}
                          >
                            <h3 style={{ marginRight: "5px" }}>{item} %</h3>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
              <div
                style={control ? { justifyContent: "center" } : null}
                className="fillSurveyFooter"
              >
                <Link to={"/Map"} className="mapButton">
                  <img
                    width="60px"
                    height="80px"
                    style={{ marginBottom: "15px" }}
                    src={World}
                    alt=""
                  />
                  <p className="worldText">See what the world said</p>
                </Link>
                <button
                  style={control ? { display: "none" } : null}
                  onClick={handleDone}
                  className="doneButton"
                >
                  Done
                </button>
              </div>

              <div></div>
            </div>
            <div className="Comments">
              <div className="">
                <h1 className="commentsTextStyle">Comments</h1>
                <div onClick={addButtonHandleClick} className="addButton">
                  <p
                    style={{ marginTop: "5px" }}
                    className="addCommentTextStyle"
                  >
                    Add Comment
                  </p>
                </div>

                {surveyCommentData.map((item, index) => {
                  console.log("yazdi: " + JSON.stringify(item));
                  const itemDate = new Date(
                    `${item.time.year}-${item.time.month}-${item.time.day} ${item.time.hour}:${item.time.minute}:${item.time.second}`
                  );
                  var distance = now.getTime() - itemDate.getTime();
                  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                  var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  );
                  var minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                  );
                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                  const test = item.author.split(" ");
                  return (
                    <ul style={{ display: "flex", flexDirection: "column" }}>
                      {item.path && item.path.length <= 1 && (
                        <div className="commentList">
                          <div className="userIcon">
                            {test.map((letter) => {
                              return (
                                <p style={{ fontSize: "15px", color: "white" }}>
                                  {letter[0]}
                                </p>
                              );
                            })}
                          </div>
                          <div className="commentInfoContainer">
                            <div className="surveyInfo">
                              <p
                                style={{
                                  marginRight: "10px",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.author}
                              </p>
                              <p>
                                {days >= 1 && days < 7
                                  ? days + " days ago"
                                  : days >= 7
                                    ? Math.floor(days / 7) + " week ago"
                                    : hours < 24 && hours >= 1
                                      ? hours + " hours ago"
                                      : minutes < 60 && minutes >= 1
                                        ? minutes + " minutes ago"
                                        : seconds < 60
                                          ? "a few seconds ago"
                                          : null}
                              </p>
                            </div>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{ fontSize: "15px", fontWeight: "bold" }}
                              >
                                {item.comment.substr(
                                  0,
                                  item.commentID === limitItem ? limit : 600
                                )}
                                <div
                                  onClick={() => {
                                    setLimitItem(item.commentID);
                                    setLimit(item.comment.lenght);
                                  }}
                                  style={{
                                    display:
                                      item.comment.length > 600
                                        ? "block"
                                        : "none",
                                    cursor: "pointer",
                                    marginTop: "4px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ...Read More
                                </div>
                              </p>
                            </div>

                            <div className="commentIconContainer">
                              <ul className="commentIconList">
                                <li
                                  onClick={() => handleUpVote(item)}
                                  className="commentListItem"
                                >
                                  {upvotedcomments.includes(item.commentID) ? (
                                    <img src={FullUpvote}></img>
                                  ) : (
                                    <img src={UpVote}></img>
                                  )}
                                  <p style={{ marginLeft: "5px" }}>
                                    {item.upvote === 0 ? "UpVote" : item.upvote}
                                  </p>
                                </li>
                                <li
                                  onClick={() => addCommentWithId(item)}
                                  className="commentListItem"
                                >
                                  <img src={Reply}></img>
                                  <p style={{ marginLeft: "5px" }}>Reply</p>
                                </li>
                                {/* report*/}                  
                                <li
                                  onClick={() => handleReport(item)}
                                  className="commentListItem"
                                >
                                  {reportedComments.includes(item.commentID) ? 
                                    <img src={FullReport}></img>
                                   : 
                                    <img src={Report}></img>
                                  }
                                  <p style={{ marginLeft: "5px" }}>
                                    {"Report"}
                                  </p>
                                  <div
                                    style={{
                                      display:
                                        selectedReport === item.commentID &&
                                          controlReportChild
                                          ? "flex"
                                          : "none"
                                    }}
                                    className="reportContainer"
                                   >
                                    <div>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "17px",
                                        }}
                                      >
                                        Are you sure?
                                      </p>
                                    </div>
                                    <div className="reportButtons">
                                      <div
                                        onClick={() =>
                                          handleYesButton(reportItem)
                                        }
                                        className="reportYes"
                                      >
                                        <p style={{ fontWeight: "bold" }}>
                                          Yes
                                        </p>
                                      </div>
                                      <div className="reportNo">
                                        <p style={{ fontWeight: "bold" }}>No</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                <li
                                  style={{
                                    display:
                                      localStorage.getItem("auth") &&
                                        JSON.parse(localStorage.getItem("auth"))
                                          .name === item.author
                                        ? "flex"
                                        : "none",
                                  }}
                                  onClick={() => handleDeleteComment(item)}
                                  className="commentListItem"
                                >
                                  <img width="15px" src={DeleteIcon}></img>
                                  <p style={{ marginLeft: "5px" }}>Delete</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.path.length <= 1 ? recursive(item, upvotedcommentslist) : null}
                      {/* {item.path.length <= 1 ? recursive(item, reportedCommentsList) : null} */}

                    </ul>
                  );
                })}
              </div>
            </div>
          </div>
        )
        /*
        <ul className='commentList'>
                <div className='userIcon'></div>
                <li>
                  <div className='surveyInfo'>
                    <p style={{marginRight:"10px"}}>username</p>
                    <p>8 hours ago</p>
                  </div>
                  {surveyCommentData.map((item) => {
                    return (
                      <p>{item}</p>
                    )
                  })}
                </li>
              </ul>
        */
      }

      {addButtonControl && (
        <div className="addButtonContainer">
          <div className="addButtonContent">
            <div class="form-group">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                class="form-control textStyle"
                id="exampleFormControlTextarea1"
                rows="18"
              ></textarea>
              <div className="commentFooter">
                <ul className="changeTextStyle">
                  <li>
                    <img src={Face} alt="" />
                  </li>
                  <li>
                    <img src={Gif} alt="" />
                  </li>
                  <li>
                    <img src={bold} alt="" />
                  </li>
                  <li>
                    <img src={Italic} alt="" />
                  </li>
                  <li>
                    <img src={Link1} alt="" />
                  </li>
                  <li>
                    <img src={Header} alt="" />
                  </li>
                  <li>
                    <img src={bulletList} alt="" />
                  </li>
                  <li>
                    <img src={NumberedList} alt="" />
                  </li>
                </ul>
                <div onClick={handleAddComment} className="commentButton">
                  <p className="addCommentTextStyle">Comment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default FillSurvey;
