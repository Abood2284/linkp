import React from "react";
import {
  Plus,
  Link,
  ShoppingBag,
  Calendar,
  Image,
  FormInput,
  Video,
  Share,
} from "lucide-react";

const EditorMockup = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Content Blocks</h2>
        <div className="space-y-2">
          {[
            { icon: Link, label: "Standard Link" },
            { icon: ShoppingBag, label: "Shop Link" },
            { icon: Calendar, label: "Booking Link" },
            { icon: Share, label: "Social Link" },
            { icon: Image, label: "Showcase" },
            { icon: FormInput, label: "Form" },
            { icon: Video, label: "Digital Product" },
            { icon: Calendar, label: "Event" },
          ].map((block, i) => (
            <div
              key={i}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-move"
            >
              <block.icon className="w-5 h-5 mr-2 text-gray-500" />
              <span>{block.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg min-h-[600px] border-2 border-dashed border-gray-300 p-4">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Plus className="w-12 h-12 mb-2" />
            <p className="text-lg">Drag blocks here</p>
            <p className="text-sm">or click to add a block</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Block Settings</h2>
        <p className="text-gray-400 text-sm">Select a block to customize</p>
      </div>
    </div>
  );
};

export default EditorMockup;
