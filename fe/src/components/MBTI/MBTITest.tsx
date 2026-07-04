import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import axios from "axios";
import { API } from "@/utils/constant";
import toast from "react-hot-toast";
import { questionsMBTI } from "@/lib/questionsMBTI";
import { optionsMBTI } from "@/lib/optionsMBTI";

const MBTITest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(70).fill(-1));
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  // Hàm tính MBTI type từ đáp án
  const calculateMBTIType = (answers: number[]): string => {
    const dimensions = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];

    let mbtiType = "";

    for (let i = 0; i < 4; i++) {
      const startIdx = i * 10;
      const endIdx = startIdx + 10;
      const dimensionAnswers = answers.slice(startIdx, endIdx);
      const typeACount = dimensionAnswers.filter((a) => a === 0).length;
      const typeBCount = dimensionAnswers.filter((a) => a === 1).length;
      mbtiType += typeACount > typeBCount ? dimensions[i][0] : dimensions[i][1];
    }

    return mbtiType;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // Nếu chưa phải câu cuối thì tăng câu lên; nếu câu cuối thì tăng để sang bước tiếp theo
    if (currentQuestion < questionsMBTI.length - 1 && !showSummary) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questionsMBTI.length - 1 && !showSummary) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      toast.error("Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài!");
      return;
    }

    if (!gender) {
      toast("Vui lòng chọn giới tính của bạn!");
      return;
    }

    setIsSubmitting(true);
    try {
      const mbtiType = calculateMBTIType(answers);
      const response = await axios.post(
        `${API}/mbti/advanced-analysis`,
        {
          answers,
          gender,
          mbtiType,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const result = response.data;
      navigate("/tools/mbti/result", { state: { result } });
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Có lỗi xảy ra khi xử lý kết quả. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  const answeredCount = answers.filter((answer) => answer !== -1).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-blue-500 to-purple-600 text-white py-8 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Làm bài trắc nghiệm MBTI miễn phí
          </h1>
          <p className="text-lg">
            Khám phá tiềm năng bản thân, tỏa sáng năng lực nghề nghiệp
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Tiến độ: {answeredCount}/{questionsMBTI.length}
            </span>
            <span className="text-sm font-medium">
              {Math.round((answeredCount / questionsMBTI.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(answeredCount / questionsMBTI.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 md:p-8">
          {currentQuestion < questionsMBTI.length ? (
            <>
              {/* Summary toggle button */}
              <button
                onClick={toggleSummary}
                className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {showSummary ? "Ẩn bảng đáp án" : "Hiển thị bảng đáp án"}
              </button>

              {/* Answers summary */}
              {showSummary && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-bold mb-2">Tổng hợp câu trả lời:</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {questionsMBTI.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentQuestion(index);
                          setShowSummary(false);
                        }}
                        className={`p-2 rounded text-center text-sm ${
                          answers[index] === -1
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        Câu {index + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600">●</span> Đã trả lời:{" "}
                    {answeredCount} |<span className="text-red-600"> ●</span>{" "}
                    Chưa trả lời: {questionsMBTI.length - answeredCount}
                  </div>
                </div>
              )}

              {/* Current question */}
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
                {questionsMBTI[currentQuestion]}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {optionsMBTI[currentQuestion].map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Quay lại
                </button>
                <span className="text-gray-500 self-center">
                  Câu {currentQuestion + 1}/{questionsMBTI.length}
                </span>
                <button
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  onClick={() => {
                    if (currentQuestion < questionsMBTI.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else if (currentQuestion === questionsMBTI.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    }
                  }}
                  disabled={false}
                >
                  Tiếp theo
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">
                Vui lòng lựa chọn giới tính của bạn
              </h2>
              <p className="mb-6 text-gray-600">
                Hình ảnh minh hoạ tính cách sẽ thay đổi tuỳ theo giới tính bạn
                chọn
              </p>

              <div className="flex justify-center gap-6 mb-8">
                <button
                  className={`px-6 py-3 rounded-lg border-2 ${
                    gender === "male"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } transition`}
                  onClick={() => setGender("male")}
                >
                  Nam
                </button>
                <button
                  className={`px-6 py-3 rounded-lg border-2 ${
                    gender === "female"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  } transition`}
                  onClick={() => setGender("female")}
                >
                  Nữ
                </button>
              </div>

              <button
                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting || !gender}
              >
                {isSubmitting ? "Đang xử lý..." : "Xem kết quả"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MBTITest;
