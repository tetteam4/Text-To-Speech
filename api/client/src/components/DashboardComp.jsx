import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiArrowNarrowUp,HiOutlineUserGroup} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {


  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);

  const { currentUser } = useSelector((state) => state.user);


  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    
    }
  }, [currentUser]);
  return (
    <div className="p-6 md:mx-auto  mt-16 pt-16">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">مجموع کاربران</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">ماه گذشته</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="md:flex w-full  gap-x-5 md:p-12 p-3">
          <div className="flex flex-col mb-5 md:mb-0 w-full md:w-[25%] shadow-md rounded-md dark:bg-gray-800">
            <div className="flex justify-between  p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recently Users</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=users"}>See More</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>photo</Table.HeadCell>
                <Table.HeadCell>UserName</Table.HeadCell>
              </Table.Head>
              {users &&
                users.map((user) => (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
