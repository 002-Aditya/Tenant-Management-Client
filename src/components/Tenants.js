import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import {Card} from "@/components/ui/card";

const TenantManager = () => {
    const [rooms, setRooms] = useState([
        {
            tenantName: "",
            numRoommates: "",
            roommates: [],
            startDate: null,
            endDate: null,
            verified: false,
            contacts: [""],
            photo: null,
        },
    ]);
    const [property, setProperty] = useState("");

    // Add new room
    const addRoom = () => {
        setRooms([
            ...rooms,
            {
                tenantName: "",
                numRoommates: "",
                roommates: [],
                startDate: null,
                endDate: null,
                verified: false,
                contacts: [""],
                photo: null,
            },
        ]);
    };

    // Remove room (only for additional rooms)
    const removeRoom = (index) => {
        if (index === 0) return;
        setRooms(rooms.filter((_, i) => i !== index));
    };

    // Handle input changes
    const handleChange = (index, field, value) => {
        const updated = [...rooms];
        updated[index][field] = value;
        setRooms(updated);
    };

    // Roommate count logic
    const handleRoommateCount = (index, value) => {
        const updated = [...rooms];
        const count = value === "" ? "" : parseInt(value, 10);
        updated[index].numRoommates = value;
        updated[index].roommates = Array.from(
            { length: count || 0 },
            (_, i) => ({
                name: updated[index].roommates[i]?.name || "",
                relationship: updated[index].roommates[i]?.relationship || "",
            })
        );
        setRooms(updated);
    };

    // Roommate detail changes
    const handleRoommateChange = (roomIndex, mateIndex, field, value) => {
        const updated = [...rooms];
        updated[roomIndex].roommates[mateIndex] = {
            ...updated[roomIndex].roommates[mateIndex],
            [field]: value,
        };
        setRooms(updated);
    };

    // Contact number handling
    const handleContactChange = (roomIndex, contactIndex, value) => {
        const updated = [...rooms];
        updated[roomIndex].contacts[contactIndex] = value;
        setRooms(updated);
    };

    const addContact = (roomIndex) => {
        const updated = [...rooms];
        updated[roomIndex].contacts.push("");
        setRooms(updated);
    };

    const removeContact = (roomIndex, contactIndex) => {
        if (rooms[roomIndex].contacts.length <= 1) return;
        const updated = [...rooms];
        updated[roomIndex].contacts.splice(contactIndex, 1);
        setRooms(updated);
    };

    // Photo upload
    const handlePhotoChange = (index, file) => {
        const updated = [...rooms];
        updated[index].photo = file;
        setRooms(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasError = false;
        rooms.forEach((room, index) => {
            if (!room.tenantName || !room.numRoommates || !room.startDate || room.contacts[0] === "") {
                hasError = true;
            }
        });
        if (!property) hasError = true;

        if (hasError) {
            toast.error("Submission Failed!", {
                description: "Please fill in all required fields.",
                style: { background: '#ff4444', color: '#fff' },
            });
            return;
        }

        console.log("Submitted:", { property, rooms });
        toast.success("Tenant Information Submitted!", {
            description: "Your tenant details have been successfully submitted.",
            style: { background: '#60ea93', color: '#000' },
        });
    };

    const relationshipOptions = ['Friend', 'Family', 'Colleague', 'Other'];

    const propertyOptions = [
        "123 Main St (Total Rooms: 10, Filled: 6)",
        "45 Park Ave (Total Rooms: 8, Filled: 4)",
        "99 Sunset Blvd (Total Rooms: 12, Filled: 10)",
    ];

    return (
        <div className="min-h-screen bg-white">
            <TooltipProvider>
                <NavBar></NavBar>
                <div className="max-w-5xl mx-auto p-6">
                    <Card className="border rounded-lg p-4 mb-6 shadow-sm">
                        <div className="mb-4">
                            <label className="text-lg font-semibold">
                                Property Address<span className="text-red-500">*</span>
                            </label>
                        </div>
                        <Select value={property} onValueChange={setProperty}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Property" />
                            </SelectTrigger>
                            <SelectContent>
                                {propertyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </Card>

                    <form onSubmit={handleSubmit}>
                        {rooms.map((room, index) => (
                            <Card
                                key={index}
                                className="border rounded-lg p-6 mb-6 bg-white shadow-sm"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">
                                        Room {index + 1} Details
                                    </h2>
                                    <div className="flex gap-3">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Plus
                                                    className="cursor-pointer hover:text-blue-600"
                                                    onClick={addRoom}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Add another room</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {index > 0 && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash2
                                                        className="cursor-pointer text-red-500 hover:text-red-600"
                                                        onClick={() => removeRoom(index)}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Remove this room</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>

                                {/* Tenant Name */}
                                <div className="mb-4">
                                    <label className="block font-medium mb-1">
                                        Tenant Name<span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter tenant name"
                                        value={room.tenantName}
                                        onChange={(e) =>
                                            handleChange(index, "tenantName", e.target.value)
                                        }
                                        className="input-focus transition-all duration-200 rounded"
                                        required
                                    />
                                </div>

                                {/* Number of Roommates */}
                                <div className="mb-4">
                                    <label className="block font-medium mb-1">
                                        Number of Roommates<span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Enter number of roommates"
                                        value={room.numRoommates}
                                        onChange={(e) =>
                                            handleRoommateCount(index, e.target.value)
                                        }
                                        className="input-focus transition-all duration-200 rounded"
                                        required
                                    />
                                </div>

                                {/* Roommates Table */}
                                {room.numRoommates > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-medium mb-2">Roommates Details</h3>
                                        {room.roommates.map((mate, i) => (
                                            <div key={i} className="flex gap-3 mb-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Name *"
                                                    value={mate.name}
                                                    onChange={(e) =>
                                                        handleRoommateChange(index, i, "name", e.target.value)
                                                    }
                                                    className="input-focus p-2 w-1/2 transition-all duration-200 rounded"
                                                    required
                                                />
                                                <Select
                                                    value={mate.relationship}
                                                    onValueChange={(value) => handleRoommateChange(index, i, "relationship", value)}
                                                >
                                                    <SelectTrigger className="w-1/2">
                                                        <SelectValue placeholder="Select Relationship *" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                    {relationshipOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                    {option}
                                                    </SelectItem>
                                                    ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Contract Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    {/* Start Date */}
                                    <div>
                                        <label className="block font-medium mb-1">
                                            Contract Start Date<span className="text-red-500">*</span>
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    {room.startDate
                                                        ? format(room.startDate, "PPP")
                                                        : "Select Start Date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start" className="p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={room.startDate}
                                                    onSelect={(date) =>
                                                        handleChange(index, "startDate", date)
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block font-medium mb-1">
                                            Contract End Date
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    {room.endDate
                                                        ? format(room.endDate, "PPP")
                                                        : "Select End Date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start" className="p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={room.endDate}
                                                    onSelect={(date) => handleChange(index, "endDate", date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Tenant Verification */}
                                <div className="flex items-center gap-2 mb-6">
                                    <Tooltip>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Checkbox
                                                checked={room.verified}
                                                onCheckedChange={(checked) =>
                                                    handleChange(index, "verified", checked)
                                                }
                                            />
                                            <TooltipTrigger asChild>
                                                <span>Tenant Verification</span>
                                            </TooltipTrigger>
                                        </label>
                                        <TooltipContent>
                                            <p>Government tenant verification is when a landlord submits their tenant's information to local police for a background check to ensure their identity and check for any criminal history. </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                {/* Contact Numbers */}
                                <div className="mb-6">
                                    <label className="block font-medium mb-1">
                                        Contact Numbers<span className="text-red-500">*</span>
                                    </label>
                                    {room.contacts.map((num, i) => (
                                        <div key={i} className="flex items-center gap-2 mb-2">
                                            <Input
                                                type="text"
                                                placeholder={`Contact Number ${i + 1}`}
                                                value={num}
                                                onChange={(e) =>
                                                    handleContactChange(index, i, e.target.value)
                                                }
                                                className="input-focus transition-all p-2 duration-200 rounded flex-1"
                                                required={i === 0}
                                            />
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Plus
                                                        className="cursor-pointer hover:text-blue-600"
                                                        onClick={() => addContact(index)}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Add another contact number</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            {i > 0 && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Trash2
                                                            className="cursor-pointer text-red-500 hover:text-red-600"
                                                            onClick={() => removeContact(index, i)}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Remove contact number</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Photo Upload */}
                                <div className="mb-6">
                                    <label className="block font-medium mb-1">
                                        Photo
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        placeholder="Upload photo"
                                        onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                                        className="input-focus transition-all duration-200 rounded w-full rounded"
                                    />
                                </div>
                            </Card>
                        ))}

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                        >
                            Submit Tenant Information
                        </Button>
                    </form>
                </div>
            </TooltipProvider>
        </div>
    );
};

export default TenantManager;