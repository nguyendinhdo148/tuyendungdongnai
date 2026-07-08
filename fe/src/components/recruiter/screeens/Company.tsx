import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Building,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CompanyFormDialog from "../components/CompanyFormDialog";
import axios from "axios";
import { API } from "@/utils/constant";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { setCompanies, setSelectedCompany } from "@/redux/companySlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import type { Company } from "@/types/company";
import CommonSkeleton from "../components/Skeleton/CommonSkeleton";
import { CustomTooltip } from "@/components/helpers/CustomTooltip";

const Company = () => {
  const { companies, selectedCompany } = useSelector(
    (store: RootState) => store.company
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/company`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setCompanies(res.data.companies));
      }
    } catch (error) {
      console.error("Fetch companies error:", error);
      toast.error("Không thể tải danh sách công ty!");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // handleAddCompany function
  const handleAddCompany = async (formData: FormData) => {
    try {
      const response = await axios.post(`${API}/company/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log(response);

      if (response.data.success) {
        toast.success("Thêm công ty thành công!");
        fetchCompanies(); // Refresh the list
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Add company error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data.message
          : "Không thể thêm công ty"
      );
    }
  };

  // handleEditCompany function
  const handleEditCompany = async (formData: FormData) => {
    try {
      const response = await axios.put(
        `${API}/company/update-company/${selectedCompany?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật công ty thành công!");
        fetchCompanies();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Edit company error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Không thể cập nhật công ty");
      }
    }
  };

  // handleDelete function
  const handleDelete = async (company_id: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa công ty này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`${API}/company/${company_id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Xóa công ty thành công!");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Delete company error:", error);
      toast.error("Không thể xóa công ty");
    }
  };

  if (isLoading) {
    return <CommonSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl shadow-lg shrink-0">
            <Building className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
              Quản lý công ty
            </h1>
            <p className="mt-1 text-xs md:text-sm text-gray-500 line-clamp-1">
              Quản lý thông tin và trạng thái công ty
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="md:h-11 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition whitespace-nowrap self-start md:self-auto"
          onClick={() => {
            setSelectedCompany(null);
            setIsDialogOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Thêm công ty mới</span>
          </div>
        </Button>
      </div>

      {/* Company List */}
      <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-0 md:p-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {companies.length > 0 ? (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[250px] text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Công ty
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Trụ sở
                  </TableHead>
                  <TableHead className="text-center w-[200px] text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Địa điểm
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Website
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Mã số thuế
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Giấy phép KD
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Ngày cập nhật
                  </TableHead>
                  <TableHead className="text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id} className="hover:bg-gray-50 transition border-b border-gray-100">
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 md:h-10 md:w-10 rounded-md shadow-sm shrink-0">
                          <AvatarImage
                            src={company.logo || ""}
                            alt={company.name}
                            className="object-contain"
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600 rounded-md">
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="font-medium text-sm md:text-base text-gray-900 max-w-[200px] truncate">
                            <CustomTooltip content={company.name}>
                              <span className="block">{company.name}</span>
                            </CustomTooltip>
                          </div>
                          <div className="text-xs text-gray-500 max-w-[200px] truncate">
                            {company.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="truncate text-sm">{company.location}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="truncate max-w-[200px] text-sm">
                        {company.address || "Chưa cập nhật"}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {new URL(company.website).hostname}
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap text-sm">
                      {company.taxCode}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      {company.businessLicense && (
                        <a
                          href={company.businessLicense}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Xem Giấy phép
                        </a>
                      )}
                    </TableCell>
                    {/* Approval status */}
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      {company.approval === "rejected" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                className="px-3 py-1 rounded-full font-medium bg-red-100 text-red-700 cursor-help"
                                variant="outline"
                                style={{
                                  minWidth: 100,
                                  justifyContent: "center",
                                }}
                              >
                                <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                                  <XCircle className="w-4 h-4 shrink-0" />
                                  <span>Từ chối</span>
                                </div>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white p-3 rounded-lg max-w-[250px] md:max-w-[300px] text-sm">
                              <p className="whitespace-pre-wrap">
                                Lý do: {company.approvalNote || "Không có"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge
                          className={
                            "px-3 py-1 rounded-full font-medium " +
                            (company.approval === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700")
                          }
                          variant="outline"
                          style={{ minWidth: 100, justifyContent: "center" }}
                        >
                          <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                            {company.approval === "approved" ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            <span>{company.approval === "approved" ? "Đã duyệt" : "Chờ duyệt"}</span>
                          </div>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                      {new Date(company.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                      {new Date(company.updatedAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-50 text-blue-600 cursor-pointer h-8 w-8"
                          onClick={() => {
                            dispatch(setSelectedCompany(company));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-50 text-red-600 cursor-pointer h-8 w-8"
                          onClick={() => handleDelete(company?._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 px-4">
              <p className="text-gray-500 text-sm md:text-base">Chưa có công ty nào được thêm.</p>
              <Button
                className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setSelectedCompany(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="size-4 mr-2" />
                Thêm công ty mới
              </Button>
            </div>
          )}
        </div>
      </Card>

      <CompanyFormDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          dispatch(setSelectedCompany(null));
        }}
        company={selectedCompany}
        onSuccess={(formData: FormData) => {
          if (selectedCompany) {
            handleEditCompany(formData);
          } else {
            handleAddCompany(formData);
          }
        }}
      />
    </div>
  );
};

export default Company;