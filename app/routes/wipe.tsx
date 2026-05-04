import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { formatSize } from "~/lib/utils";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    if(files.length === 0) return;
    setLoading(true);
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    setLoading(false);
    loadFiles();
    
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img src="/images/resume-scan-2.gif" className="w-50" />
      </div>
    );
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="flex flex-col gap-2 relative bg-[url('/images/bg-wipe.png')] bg-cover min-h-screen items-center">

  <div className="flex w-screen justify-between">
     <nav className='resume-nav'>
        <Link to="/" className='back-button bg-amber-200 shadow-md hover:shadow-gray-300'>
        <img src="/icons/back.svg" alt="logo"  className='w-2.5 h-2.5'/>
        <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
        </Link>
      </nav>
      <div className="flex items-center relative">
          <img src="/images/profile.png" alt="profile" className="size-15 p-1 cursor-pointer shadow-lg hover:shadow-amber-200 bg-gray-200 rounded-full mr-2 mt-2" onClick={()=> setShowProfile(!showProfile)}/>
      
        {showProfile && (
            <div className="absolute right-10 top-20 p-4 bg-[url('/images/bg-auth.svg')] bg-cover rounded-lg items-center flex flex-col gap-4  transition-all duration-500">
                <h2 className="font-bold">Profile</h2>
               <p className=" text-gray-800 font-bold flex items-center gap-2">Username: <span className="text-sm text-gray-500">{auth.user?.username}</span></p> 
               <p className="text-md font-bold bg-red-400 p-2 rounded-full text-gray-200 shadow-md hover:shadow-amber-700 cursor-pointer" onClick={()=> navigate("/auth?next=/")}>Logout</p>
            </div>
        )}
      </div>
      </div>
    
      
      <div className="text-2xl text-gray-200 font-bold mt-10">Existing files:</div>
     
  {loading ? (
 <div className="flex flex-col items-center justify-center">
        <img src="/images/resume-scan-2.gif" className="w-50" />
      </div>
     ):(
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="uploader-selected-file gradient-border">
            <img src="/images/pdf.png" alt="pdf" className="size-10" />
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>
            </div>
            <div className="">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer shadow-md hover:shadow-gray-800"
                onClick={ () => {
                  setSelectedFile(file);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
)}
     
      

     {selectedFile && (
        <div className="w-full h-screen absolute bg-transparent flex items-center justify-center " onClick={()=>setSelectedFile(null)}>
         <div className="bg-linear-to-b from-blue-300 to-purple-400 shadow-lg flex-col space-y-5 rounded-md p-4 transition-all duration-800" onClick={(e) => e.stopPropagation()}>

          
                <p className="text-gray-800 text-xl font-medium">Are you sure you want to permanently delete this file?</p>
            
            <div className="flex items-center justify-center gap-8">
                <img src="/images/pdf.png" alt="pdf" className="size-20" />
            <div>
                 <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>

            </div>
            </div>
            <div className="mt-5 flex justify-end gap-4">
                  <button
          className="bg-gray-600 text-white px-4 py-2 rounded-md cursor-pointer font-bold shadow-md hover:shadow-gray-800"
          onClick={() => setSelectedFile(null)}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer font-bold shadow-md hover:shadow-gray-800"
          onClick={async() => {
            setSelectedFile(null)
            setLoading(true);
            await fs.delete(selectedFile.path);
            await kv.flush();
            loadFiles()
            setLoading(false); 
           // window.location.reload();
          }}
        >
          Delete
        </button>
      </div>
       
      </div>
      </div>
     )}

      
      {files.length === 0 ? (
        <div>
            <h2 >No Files Found</h2>
        </div>
     ):(
      <div className="mt-5">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer shadow-md hover:shadow-gray-800"
          onClick={() => handleDelete()}
        >
          {loading ? (
            <span className="animate-pulse duration-1000 ">Wiping...</span>
          ):(
            <span>Wipe App Data</span>
          )}
        </button>
      </div>
      )}
    
    </div>
  );
};

export default WipeApp;
