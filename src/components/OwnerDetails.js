import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import NavBar from "@/components/NavBar";
import { Plus, Trash2 } from "lucide-react";

const OwnerDetails = () => {
    const [tenantAddresses, setTenantAddresses] = useState([{ id: Date.now(), address: '' }]);
    const [buildingEntries, setBuildingEntries] = useState([{ id: Date.now() }]);

    // Form for Basic Information
    const basicInfoForm = useForm({
        defaultValues: {
            fullName: '',
            personalAddress: '',
            contactNumber: '',
            emailAddress: '',
            tenantAddresses: [{ id: Date.now(), address: '', propertyType: '' }],
        },
    });

    // Form for Rental Building Details
    const buildingDetailsForm = useForm({
        defaultValues: {
            buildingDetails: [{ property: '', totalRooms: '', filledRooms: '', emptyRooms: '' }],
        },
    });

    const { control: basicControl, handleSubmit: handleBasicSubmit, watch: watchBasic, setValue: setBasicValue } = basicInfoForm;
    const { control: buildingControl, handleSubmit: handleBuildingSubmit, watch: watchBuilding, setValue: setBuildingValue } = buildingDetailsForm;

    // Add tenant address
    const addTenantAddress = () => {
        const newId = Date.now();
        setTenantAddresses([...tenantAddresses, { id: newId, address: '' }]);
        setBasicValue('tenantAddresses', [...watchBasic('tenantAddresses'), { id: newId, address: '', propertyType: '' }]);
    };

    // Remove tenant address
    const removeTenantAddress = (id, index) => {
        setTenantAddresses(tenantAddresses.filter(addr => addr.id !== id));
        const updatedAddresses = watchBasic('tenantAddresses').filter((_, i) => i !== index);
        setBasicValue('tenantAddresses', updatedAddresses);
    };

    // Add building entry
    const addBuildingEntry = () => {
        const newId = Date.now();
        setBuildingEntries([...buildingEntries, { id: newId }]);
        setBuildingValue('buildingDetails', [...watchBuilding('buildingDetails'), { property: '', totalRooms: '', filledRooms: '', emptyRooms: '' }]);
    };

    // Remove building entry
    const removeBuildingEntry = (id, index) => {
        setBuildingEntries(buildingEntries.filter(entry => entry.id !== id));
        const updatedEntries = watchBuilding('buildingDetails').filter((_, i) => i !== index);
        setBuildingValue('buildingDetails', updatedEntries);
    };

    // Submit handler for Basic Information
    const onBasicSubmit = (data) => {
        console.log('Basic Information Data:', data);
        toast('Basic Information submitted successfully!', {
            description: 'Your details have been saved.',
            style: { background: '#2ec5bc', color: '#000' },
        });
    };

    // Submit handler for Rental Building Details
    const onBuildingSubmit = (data) => {
        console.log('Building Details Data:', data);
        toast('Building Details submitted successfully!', {
            description: 'Your building details have been saved.',
            style: { background: '#60ea93', color: '#000' },
        });
    };

    const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse'];

    // Filter out tenant addresses that are empty or undefined to avoid SelectItem error
    const validTenantAddresses = watchBasic('tenantAddresses').filter(addr => addr && addr.address && addr.address.trim() !== '');

    // Get selected property IDs for disabling in dropdowns
    const buildingDetails = watchBuilding('buildingDetails');
    const selectedPropertyIds = buildingDetails
        .map((detail, index) => ({ property: detail.property, index }))
        .filter(detail => detail.property)
        .map(detail => detail.property);

    // Autopopulate Number of Empty Rooms for each building detail entry
    useEffect(() => {
        buildingEntries.forEach((_, index) => {
            const totalRooms = parseInt(watchBuilding(`buildingDetails.${index}.totalRooms`)) || 0;
            const filledRooms = parseInt(watchBuilding(`buildingDetails.${index}.filledRooms`)) || 0;
            const emptyRooms = totalRooms - filledRooms >= 0 ? totalRooms - filledRooms : 0;
            setBuildingValue(`buildingDetails.${index}.emptyRooms`, emptyRooms.toString(), { shouldValidate: true });
        });
    }, [buildingDetails, watchBuilding, setBuildingValue]);

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-4xl mx-auto p-6">
                {/* Section 1: Basic Information */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...basicInfoForm}>
                            <form onSubmit={handleBasicSubmit(onBasicSubmit)} className="space-y-6">
                                <FormField
                                    control={basicControl}
                                    name="fullName"
                                    rules={{ required: 'Full Name is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={basicControl}
                                    name="personalAddress"
                                    rules={{ required: 'Personal Address is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personal Address<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your personal address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Card className="border p-4 relative">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg font-medium">Tenant Addresses</CardTitle>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={addTenantAddress}
                                            className="h-8 w-8"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {tenantAddresses.map((addr, index) => (
                                            <div key={addr.id} className="relative border p-4 rounded-md">
                                                {tenantAddresses.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeTenantAddress(addr.id, index)}
                                                        className="absolute top-2 right-2 h-8 w-8"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantAddresses.${index}.propertyType`}
                                                    rules={{ required: 'Property Type is required' }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Property Type</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select property type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {propertyTypes.map((type) => (
                                                                        <SelectItem key={type} value={type}>
                                                                            {type}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantAddresses.${index}.address`}
                                                    rules={{ required: 'Tenant Address is required' }}
                                                    render={({ field }) => (
                                                        <FormItem className="mt-4">
                                                            <FormLabel>Tenant Address {index + 1}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter tenant address"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    onChange={(e) => {
                                                                        field.onChange(e);
                                                                        const updatedAddresses = [...tenantAddresses];
                                                                        updatedAddresses[index].address = e.target.value;
                                                                        setTenantAddresses(updatedAddresses);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                                <FormField
                                    control={basicControl}
                                    name="contactNumber"
                                    rules={{
                                        required: 'Contact Number is required',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Enter a valid 10-digit phone number',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="Enter your contact number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={basicControl}
                                    name="emailAddress"
                                    rules={{
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Enter a valid email address',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                                >
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Section 2: Rental Building Details */}
                <Card className="shadow-lg mt-9">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Rental Building Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...buildingDetailsForm}>
                            <form onSubmit={handleBuildingSubmit(onBuildingSubmit)} className="space-y-6">
                                <Card className="border p-4 relative">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg font-medium">Building Details</CardTitle>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={addBuildingEntry}
                                            className="h-8 w-8"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {buildingEntries.map((entry, index) => (
                                            <div key={entry.id} className="relative border p-4 rounded-md">
                                                {buildingEntries.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeBuildingEntry(entry.id, index)}
                                                        className="absolute top-2 right-2 h-8 w-8"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <FormField
                                                    control={buildingControl}
                                                    name={`buildingDetails.${index}.property`}
                                                    rules={{ required: 'Property selection is required' }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Property {index + 1}</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a property" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {validTenantAddresses.length > 0 ? (
                                                                        validTenantAddresses.map((addr) => (
                                                                            <SelectItem
                                                                                key={addr.id}
                                                                                value={addr.id.toString()}
                                                                                disabled={selectedPropertyIds.includes(addr.id.toString()) && selectedPropertyIds.indexOf(addr.id.toString()) !== index}
                                                                            >
                                                                                {addr.address}
                                                                            </SelectItem>
                                                                        ))
                                                                    ) : (
                                                                        <SelectItem value="no-address" disabled>
                                                                            No valid addresses available
                                                                        </SelectItem>
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={buildingControl}
                                                    name={`buildingDetails.${index}.totalRooms`}
                                                    rules={{
                                                        required: 'Total number of rooms is required',
                                                        pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                                    }}
                                                    render={({ field }) => (
                                                        <FormItem className="mt-4">
                                                            <FormLabel>Total Number of Rooms</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Enter total rooms" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={buildingControl}
                                                    name={`buildingDetails.${index}.filledRooms`}
                                                    rules={{
                                                        required: 'Number of filled rooms is required',
                                                        pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                                        validate: {
                                                            notExceedTotal: (value) => {
                                                                const totalRooms = parseInt(watchBuilding(`buildingDetails.${index}.totalRooms`)) || 0;
                                                                const filledRooms = parseInt(value) || 0;
                                                                return filledRooms <= totalRooms || 'Filled rooms cannot exceed total rooms';
                                                            },
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <FormItem className="mt-4">
                                                            <FormLabel>Number of Rooms Filled</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Enter filled rooms" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={buildingControl}
                                                    name={`buildingDetails.${index}.emptyRooms`}
                                                    rules={{
                                                        required: 'Number of empty rooms is required',
                                                        pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                                    }}
                                                    render={({ field }) => (
                                                        <FormItem className="mt-4">
                                                            <FormLabel>Number of Empty Rooms</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Auto-calculated" {...field} readOnly />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Button
                                    type="submit"
                                    className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                                >
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OwnerDetails;