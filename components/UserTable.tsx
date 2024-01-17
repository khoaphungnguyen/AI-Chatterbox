"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import Pagination from "./Pagination";

interface User {
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export default function UsersTable({ searchTerm }: { searchTerm: string }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers().then((data) => setUsers(data));
  }, []);

  const memoizedUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }

    return users.filter(
      (user: User) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
  const totalPages = Math.ceil(memoizedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = memoizedUsers.slice(startIndex, endIndex);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Verified</TableHeaderCell>
            <TableHeaderCell>Created At</TableHeaderCell>
            <TableHeaderCell>Last Login</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentUsers.map((user: User) => (
            <TableRow key={user.email}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>
                <Text>{user.email}</Text>
              </TableCell>
              <TableCell>
                {user.emailVerified === true ? "True" : "False"}
              </TableCell>
              <TableCell>
                <Text>
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(user.createdAt)
                  )}
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(user.lastLogin)
                  )}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
