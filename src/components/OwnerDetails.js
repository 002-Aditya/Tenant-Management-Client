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
    const [buildingEntries, setBuildingEntries] = useState([{ id: Date.now() }]);

    // Form for Basic Information
    const basicInfoForm = useForm({
        defaultValues: {
            fullName: '',
            personalAddress: '',
            contactNumber: '',
            emailAddress: '',
            numTenantProperties: 1,
            tenantProperties: [{ id: Date.now(), propertyType: '', address: '' }],
        },
    });

    // Form for Rental Building Details
    const buildingDetailsForm = useForm({
        defaultValues: {
            numBuildingDetails: 1,
            buildingDetails: [{ id: Date.now(), property: '', totalRooms: '', filledRooms: '', emptyRooms: '' }],
        },
    });

    const { control: basicControl, handleSubmit: handleBasicSubmit, watch: watchBasic, setValue: setBasicValue } = basicInfoForm;
    const { control: buildingControl, handleSubmit: handleBuildingSubmit, watch: watchBuilding, setValue: setBuildingValue } = buildingDetailsForm;

    const numTenantProperties = watchBasic('numTenantProperties');
    const tenantProperties = watchBasic('tenantProperties');
    const numBuildingDetails = watchBuilding('numBuildingDetails');
    const buildingDetails = watchBuilding('buildingDetails');

    // Sync tenant properties based on numTenantProperties
    useEffect(() => {
        const count = parseInt(numTenantProperties, 10) || 0;
        const currentCount = tenantProperties.length;
        if (count > currentCount) {
            const newProperties = Array.from({ length: count - currentCount }, () => ({ id: Date.now() + Math.random(), propertyType: '', address: '' }));
            setBasicValue('tenantProperties', [...tenantProperties, ...newProperties]);
        } else if (count < currentCount) {
            setBasicValue('tenantProperties', tenantProperties.slice(0, count));
        }
    }, [numTenantProperties, tenantProperties.length, setBasicValue]);

    // Sync building details based on numBuildingDetails
    useEffect(() => {
        const count = parseInt(numBuildingDetails, 10) || 0;
        const currentCount = buildingDetails.length;
        if (count > currentCount) {
            const newEntries = Array.from({ length: count - currentCount }, () => ({ id: Date.now() + Math.random(), property: '', totalRooms: '', filledRooms: '', emptyRooms: '' }));
            setBuildingValue('buildingDetails', [...buildingDetails, ...newEntries]);
        } else if (count < currentCount) {
            setBuildingValue('buildingDetails', buildingDetails.slice(0, count));
        }
    }, [numBuildingDetails, buildingDetails.length, setBuildingValue]);

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

    // Filter out tenant properties that are empty or undefined to avoid SelectItem error
    const validTenantProperties = watchBasic('tenantProperties').filter(prop => prop && prop.address && prop.address.trim() !== '');

    // Get selected property IDs for disabling in dropdowns
    const selectedPropertyIds = buildingDetails
        .map((detail, index) => ({ property: detail.property, index }))
        .filter(detail => detail.property)
        .map(detail => detail.property);

    // Autopopulate Number of Empty Rooms for each building detail entry
    useEffect(() => {
        buildingDetails.forEach((_, index) => {
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
                                                <Input required className="input-focus p-2 w-full transition-all duration-200 rounded" placeholder="Enter your full name" {...field} />
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
                                                <Input required className="input-focus p-2 w-full transition-all duration-200 rounded" placeholder="Enter your personal address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-4">
                                    <FormField
                                        control={basicControl}
                                        name="numTenantProperties"
                                        rules={{
                                            required: 'Number of Tenant Properties is required',
                                            min: { value: 1, message: 'Minimum 1 tenant property is required' },
                                            pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Tenant Properties<span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="Enter number of tenant properties"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {parseInt(numTenantProperties, 10) > 0 && (
                                        <Card className="space-y-4 bg-gray-50 p-4 rounded-md" style={{ backgroundColor: 'rgba(182,180,182,0.54)' }}>
                                            <h3 className="font-medium text-lg">Properties Details</h3>
                                            <div className="flex gap-3 mb-2">
                                                <FormLabel className="w-1/2 font-medium">Address <span className="text-red-500">*</span></FormLabel>
                                                <FormLabel className="w-1/2 font-medium">Property Type <span className="text-red-500">*</span></FormLabel>
                                            </div>
                                            {Array.from({ length: parseInt(numTenantProperties) || 0 }).map((_, index) => (
                                                <div key={tenantProperties[index]?.id || index} className="flex gap-3">
                                                    <div className="flex-1">
                                                        <FormField
                                                            control={basicControl}
                                                            name={`tenantProperties.${index}.address`}
                                                            rules={{ required: 'Address is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="input-focus p-2 w-full transition-all duration-200 rounded"
                                                                            placeholder="Address *"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <FormField
                                                            control={basicControl}
                                                            name={`tenantProperties.${index}.propertyType`}
                                                            rules={{ required: 'Property Type is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Property Type *" />
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
                                                    </div>
                                                </div>
                                            ))}
                                        </Card>
                                    )}
                                </div>
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
                                                <Input type="tel" required className="input-focus p-2 w-full transition-all duration-200 rounded" placeholder="Enter your contact number" {...field} />
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
                                                <Input type="email" className="input-focus p-2 w-full transition-all duration-200 rounded" placeholder="Enter your email address" {...field} />
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
            </div>
        </div>
    );
};

export default OwnerDetails;